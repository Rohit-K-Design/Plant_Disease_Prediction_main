from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import google.generativeai as genai
import uvicorn

app = FastAPI()

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your model
MODEL = tf.keras.models.load_model("../saved_models/1.keras")
CLASS_NAMES = ["Early Blight in Potato", "Late Blight in Potato", "Healthy Potato"]

# Setup Gemini API
genai.configure(api_key="GEMINI_API_KEY")  # replace with your key

# Helper to read image
def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((256, 256))
    return np.array(image)

@app.get("/ping")
async def ping():
    return {"message": "Alive"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = read_file_as_image(contents)
        img_batch = np.expand_dims(image, axis=0)

        predictions = MODEL.predict(img_batch)
        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        confidence = float(np.max(predictions[0]))

        # Ask Gemini for mitigation steps and product suggestions
        prompt = f"What are the best mitigation steps and 3 recommended commercial products for {predicted_class} in plants?"
        model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")
        response = model.generate_content(prompt)

        return {
            "class": predicted_class,
            "confidence": confidence,
            "advice": response.text.strip()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
class GPTRequest(BaseModel):
    prompt: str
@app.post("/gpt")
async def get_mitigation_steps(request: GPTRequest):
    try:
        model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")
        response = model.generate_content(f"You are a plant disease expert. {request.prompt}")
        return {"steps": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
