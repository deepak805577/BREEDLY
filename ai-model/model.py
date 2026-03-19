from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image

model = load_model("dog_breed_model.h5")

breeds = [
"Labrador",
"Beagle",
"Poodle",
"German Shepherd",
"Husky"
]

def predict_breed(img_path):

    img = Image.open(img_path).resize((224,224))
    img = np.array(img)/255.0
    img = img.reshape(1,224,224,3)

    prediction = model.predict(img)
    breed = breeds[np.argmax(prediction)]

    return breed