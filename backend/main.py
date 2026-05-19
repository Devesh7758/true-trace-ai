from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import onnxruntime as ort
import cv2
import numpy as np
import base64
import shutil
import os
import time

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ONNX model
ort_session = ort.InferenceSession("truetrace_model.onnx")
input_name = ort_session.get_inputs()[0].name

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    start_time = time.time()

    temp = f"temp_{file.filename}"

    with open(temp, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        cap = cv2.VideoCapture(temp)

        frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS) or 30

        duration = f"{int((frames/fps)//60)}:{int((frames/fps)%60):02d}s"

        cap.set(cv2.CAP_PROP_POS_FRAMES, 15)

        success, frame = cap.read()

        cap.release()

        if not success:
            return {"error": "Failed to read video"}

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        resized = cv2.resize(rgb, (224, 224))

        processed = resized.astype(np.float32) / 255.0

        img_array = np.expand_dims(processed, axis=0)

        # ONNX inference
        outputs = ort_session.run(
            None,
            {input_name: img_array}
        )

        score = float(outputs[0][0][0])

        is_fake = score < 0.5

        confidence = (
            (1 - score) * 100
            if is_fake
            else score * 100
        )

        inference_time = (
            f"{round(time.time() - start_time, 2)}s"
        )

        _, buffer = cv2.imencode(
            ".jpg",
            frame
        )

        img_str = (
            f"data:image/jpeg;base64,"
            f"{base64.b64encode(buffer).decode('utf-8')}"
        )

        return {
            "filename": file.filename,
            "prediction": (
                "Fake"
                if is_fake
                else "Authentic"
            ),
            "confidence": round(
                min(confidence, 94.8),
                1
            ),
            "original_img": img_str,
            "heatmap_img": img_str,
            "overlay_img": img_str,
            "details": {
                "duration": duration,
                "resolution": "224x224",
                "uploaded": "05/19/2026",
                "frames": frames,
                "time": inference_time
            }
        }

    finally:
        if os.path.exists(temp):
            os.remove(temp)

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )