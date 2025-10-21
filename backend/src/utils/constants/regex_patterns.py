"""Regular expression patterns for validation."""
import re


class RegexPatterns:
    """Common regex patterns."""

    EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    UUID = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.IGNORECASE)
    PHONE = re.compile(r"^\+?1?\d{9,15}$")
    URL = re.compile(r"^https?://[^\s/$.?#].[^\s]*$", re.IGNORECASE)


# Export singleton instance
REGEX = RegexPatterns()
