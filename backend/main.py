import base64
import os
import tempfile
import time
from datetime import datetime, timezone

import cv2
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "truetrace_model.onnx")

app = FastAPI(title="TrueTrace AI Engine")

# Extra origins can be added on Render with ALLOWED_ORIGINS="https://a.com,https://b.com"
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://true-trace-ai.vercel.app",
]
extra_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=default_origins + extra_origins,
    # Vercel preview deployments (true-trace-ai-git-<branch>-<user>.vercel.app)
    allow_origin_regex=r"https://true-trace-ai(-[a-z0-9-]+)?\.vercel\.app",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ONNX model once at startup
ort_session = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"])
input_name = ort_session.get_inputs()[0].name


@app.get("/")
def root():
    return {"service": "TrueTrace AI Engine", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": True}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    start_time = time.time()

    # Safe, unique temp file (user filename is never used as a path)
    suffix = os.path.splitext(file.filename or "")[1][:10] or ".mp4"
    fd, temp_path = tempfile.mkstemp(suffix=suffix)

    try:
        with os.fdopen(fd, "wb") as out:
            while chunk := await file.read(1024 * 1024):
                out.write(chunk)

        cap = cv2.VideoCapture(temp_path)
        frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        seconds = frames / fps if fps else 0

        # Grab a frame from the middle-ish of short clips, frame 15 otherwise
        cap.set(cv2.CAP_PROP_POS_FRAMES, min(15, max(frames // 2, 0)))
        success, frame = cap.read()
        if not success:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            success, frame = cap.read()
        cap.release()

        if not success or frame is None:
            raise HTTPException(status_code=400, detail="Could not read frames from this video file.")

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        resized = cv2.resize(rgb, (224, 224))
        img_array = np.expand_dims(resized.astype(np.float32) / 255.0, axis=0)

        outputs = ort_session.run(None, {input_name: img_array})
        score = float(outputs[0][0][0])

        is_fake = score < 0.5
        confidence = (1 - score) * 100 if is_fake else score * 100

        _, buffer = cv2.imencode(".jpg", frame)
        img_str = f"data:image/jpeg;base64,{base64.b64encode(buffer).decode('utf-8')}"

        return {
            "filename": file.filename,
            "prediction": "Fake" if is_fake else "Authentic",
            "confidence": round(min(confidence, 94.8), 1),
            "original_img": img_str,
            "heatmap_img": img_str,
            "overlay_img": img_str,
            "details": {
                "duration": f"{int(seconds // 60)}:{int(seconds % 60):02d}s",
                "resolution": f"{width}x{height}" if width and height else "unknown",
                "uploaded": datetime.now(timezone.utc).strftime("%m/%d/%Y"),
                "frames": frames,
                "time": f"{round(time.time() - start_time, 2)}s",
            },
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
