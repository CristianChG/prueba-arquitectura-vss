import pandas as pd

class HatoDataCleaner:
    def __init__(self, df: pd.DataFrame):
        """
        Inicializa la clase con un DataFrame.
        Se trabaja sobre una copia para no modificar el original.
        """
        self.df = df.copy()

    def filter_groups(self):
        """
        Elimina las categorías que no son relevantes para el estudio
        (ESTABLO INICIAL, MACHOS, etc.).
        """
        groups_to_remove = ['ESTABLO INICIAL', 'MACHOS', 'BECERRAS/NOVILLAS', 'SECAS', 'RETO']
        if 'Nombre del grupo' in self.df.columns:
            self.df = self.df[~self.df['Nombre del grupo'].isin(groups_to_remove)]
        return self

    def select_columns(self):
        """
        Selecciona únicamente las columnas relevantes para el modelo y la aplicación.
        """
        selected_columns = [
            'Número del animal',
            'Nombre del grupo',  # Required by application
            'Estado de la reproducción',
            'Nº Lactación',
            'Días en ordeño',
            'Número de inseminaciones',
            'Días preñada',
            'Días para el parto',
            'Producción de leche ayer',
            'Producción media diaria últimos 7 días',
            'Producción TOTAL en lactación',
            'Número(s) de selección de animal'  # Required by application
        ]
        # Verificar que las columnas existan para evitar errores
        existing_cols = [col for col in selected_columns if col in self.df.columns]
        self.df = self.df[existing_cols]
        return self

    def handle_missing_values(self):
        """
        Sustituye los valores nulos por 0.
        """
        self.df.fillna(0, inplace=True)
        return self

    def run_pipeline(self) -> pd.DataFrame:
        """
        Ejecuta todos los pasos del pipeline secuencialmente y retorna el DataFrame limpio.
        """
        (self.filter_groups()
             .select_columns()
             .handle_missing_values())
        return self.df
