from typing import Protocol, Optional, List
from domain.entities import Dataset


class IDatasetRepository(Protocol):
    """Dataset repository interface following the Repository pattern."""

    async def find_by_id(self, dataset_id: str) -> Optional[Dataset]:
        """Find dataset by ID."""
        ...

    async def find_by_uploader(self, user_id: str) -> List[Dataset]:
        """Find all datasets uploaded by a specific user."""
        ...

    async def create(self, dataset: Dataset) -> Dataset:
        """Create a new dataset record."""
        ...

    async def update(self, dataset: Dataset) -> Dataset:
        """Update existing dataset."""
        ...

    async def delete(self, dataset_id: str) -> None:
        """Delete dataset by ID."""
        ...

    async def find_all(self) -> List[Dataset]:
        """Get all datasets."""
        ...

    async def find_by_status(self, status: str) -> List[Dataset]:
        """Find datasets by processing status."""
        ...
