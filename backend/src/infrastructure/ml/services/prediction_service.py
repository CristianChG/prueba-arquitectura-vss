import os
import logging
import numpy as np
from typing import List, Dict, Any, Optional
import joblib

# Configure logging
logger = logging.getLogger(__name__)

try:
    import tensorflow as tf
except ImportError:
    logger.warning("TensorFlow not installed. Keras models will be disabled.")
    tf = None

class PredictionService:
    """Service for making predictions using a loaded Keras or Pickle model."""

    def __init__(self, model_dir: str):
        self.model_dir = model_dir
        self.model = None
        self.model_type = None  # 'keras' or 'sklearn'
        self._load_model()

    def _load_model(self):
        """Loads the first .keras or .pkl model found in the model directory."""
        if not os.path.exists(self.model_dir):
            logger.warning(f"Model directory {self.model_dir} does not exist.")
            return

        # Look for models
        model_files = os.listdir(self.model_dir)
        keras_files = [f for f in model_files if f.endswith('.keras')]
        pkl_files = [f for f in model_files if f.endswith('.pkl')]
        
        if keras_files and tf:
            model_path = os.path.join(self.model_dir, keras_files[0])
            try:
                self.model = tf.keras.models.load_model(model_path)
                self.model_type = 'keras'
                logger.info(f"Successfully loaded Keras model from {model_path}")
                return
            except Exception as e:
                logger.error(f"Failed to load Keras model from {model_path}: {str(e)}")

        if pkl_files:
            model_path = os.path.join(self.model_dir, pkl_files[0])
            try:
                self.model = joblib.load(model_path)
                self.model_type = 'sklearn'
                logger.info(f"Successfully loaded Pickle model from {model_path}")
                return
            except Exception as e:
                logger.error(f"Failed to load Pickle model from {model_path}: {str(e)}")

        if not self.model:
            logger.warning(f"No valid model found in {self.model_dir}")

    def predict_cow_category(self, cow_data: Dict[str, Any]) -> Optional[int]:
        """
        Predicts the category for a single cow.
        
        Args:
            cow_data: Dictionary containing cow metrics.
            
        Returns:
            Predicted category (1: En Producción, 0: En Monitoreo, 2: Previo a Secado) or None if prediction fails.
        """
        if not self.model:
            return None

        try:
            # Extract features expected by the model
            # Note: This needs to match the model's expected input shape and feature order.
            # Assuming a simple array input for now based on available fields.
            
            # Extract features expected by the model
            # Feature order from inspection:
            # 1. Nº Lactación
            # 2. Días en ordeño
            # 3. Número de inseminaciones
            # 4. Días preñada
            # 5. Días para el parto
            # 6. Producción de leche ayer
            # 7. Producción media diaria últimos 7 días
            # 8. Producción TOTAL en lactación
            
            features_list = [
                float(cow_data.get('numero_lactacion', 0) or 0),
                float(cow_data.get('dias_ordeno', 0) or 0),
                float(cow_data.get('numero_inseminaciones', 0) or 0),
                float(cow_data.get('dias_prenada', 0) or 0),
                float(cow_data.get('dias_para_parto', 0) or 0),
                float(cow_data.get('produccion_leche_ayer', 0) or 0),
                float(cow_data.get('produccion_media_7dias', 0) or 0),
                float(cow_data.get('produccion_total_lactacion', 0) or 0)
            ]
            
            # Simple feature vector
            features = np.array([features_list])
            
            logger.info(f"Predicting for cow with features: {features_list}")

            # Make prediction based on model type
            if self.model_type == 'keras':
                prediction = self.model.predict(features, verbose=0)
                predicted_class = np.argmax(prediction, axis=1)[0]
                logger.info(f"Keras prediction: {predicted_class}")
                return int(predicted_class)
                
            elif self.model_type == 'sklearn':
                prediction = self.model.predict(features)
                logger.info(f"Sklearn prediction raw: {prediction}")
                return int(prediction[0])
            
            return None
            
        except Exception as e:
            logger.error(f"Error making prediction for cow {cow_data.get('numero_animal')}: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            return None
