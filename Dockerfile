FROM python:3.12-slim
RUN apt-get update && apt-get install -y git

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["sh","-c","python - <<'PY'\n\
import sys\n\
print('Python:', sys.version)\n\
try:\n\
    import google\n\
    print('google package:', getattr(google,'__file__', None))\n\
    from google import genai\n\
    print('SUCCESS: imported genai')\n\
except Exception as e:\n\
    import traceback\n\
    traceback.print_exc()\n\
PY"]