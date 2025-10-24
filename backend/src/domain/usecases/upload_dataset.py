from domain.entities import Dataset
from domain.repositories import IDatasetRepository


class UploadDataset:
    """Use case for uploading a dataset."""

    def __init__(self, dataset_repository: IDatasetRepository):
        self.dataset_repository = dataset_repository

    async def execute(self, dataset: Dataset) -> Dataset:
        """Execute upload dataset use case."""
        if not dataset.name or not dataset.file_path:
            raise ValueError("Dataset name and file path are required")

        if dataset.file_size <= 0:
            raise ValueError("Invalid file size")

        return await self.dataset_repository.create(dataset)
