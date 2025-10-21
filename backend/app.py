"""
Main application entry point.
Uses the application factory pattern with clean architecture.
"""
import sys
import os

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.app_factory import create_app

# Create Flask application using factory pattern
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
