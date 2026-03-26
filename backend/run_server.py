"""Run this instead of 'uvicorn app:app' to see the full startup error."""
import traceback
try:
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000)
except Exception as e:
    traceback.print_exc()
    input("\nPress Enter to exit...")
