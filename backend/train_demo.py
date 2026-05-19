import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# 1. SETUP PATHS
BASE_DIR = 'training_data'
EXTRACTED_DIR = 'extracted_frames'
# The model we JUST finished (72% accuracy)
MODEL_NAME = 'truetrace_demo_model.h5' 

# (Keep your prepare_data() function here, but it will skip if frames exist)

# 2. LOAD OR BUILD MODEL
if os.path.exists(MODEL_NAME):
    print(f"--- Loading existing model: {MODEL_NAME} to continue training ---")
    model = tf.keras.models.load_model(MODEL_NAME)
else:
    print("--- No model found, starting from scratch ---")
    base_model = tf.keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
    base_model.trainable = False 
    model = tf.keras.Sequential([
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])

# 3. PREPARE DATA (Batch Size 16 is good for your RTX 3050)
datagen = ImageDataGenerator(rescale=1./255, horizontal_flip=True)
train_generator = datagen.flow_from_directory(
    EXTRACTED_DIR, target_size=(224, 224), batch_size=16, class_mode='binary'
)

# 4. CONTINUE TRAINING
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.00005), # Lower LR for fine-tuning
              loss='binary_crossentropy', metrics=['accuracy'])

print("--- Resuming for 30 more epochs ---")
model.fit(train_generator, epochs=30) 

# 5. SAVE OVERWRITE
model.save(MODEL_NAME)
print("✅ SUCCESS: Model updated and saved.")