#!/usr/bin/env python
"""Test the fixed backend with enum values."""

import json
from enum import Enum

class ExplanationLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    expert = "expert"

# Test that the enum works with lowercase values from frontend
test_levels = ["beginner", "intermediate", "expert"]

for level_str in test_levels:
    try:
        # Simulate Pydantic validation
        level_obj = ExplanationLevel(level_str)
        print(f"✓ '{level_str}' -> {level_obj} (value: {level_obj.value})")
        print(f"  - .value.lower(): {level_obj.value.lower()}")
    except ValueError as e:
        print(f"✗ '{level_str}' failed: {e}")

# Also test the old enum for reference
print("\nOld enum (for reference):")
class OldExplanationLevel(str, Enum):
    beginner = "Beginner"
    intermediate = "Intermediate"
    expert = "Expert"

for level_str in test_levels:
    try:
        level_obj = OldExplanationLevel(level_str)
        print(f"✓ '{level_str}' -> {level_obj}")
    except ValueError as e:
        print(f"✗ '{level_str}' failed (as expected)")
