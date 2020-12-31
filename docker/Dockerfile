FROM python:3.9-alpine

ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apk update \
  # psycopg2 dependencies
  && apk add --virtual build-deps gcc python3-dev musl-dev \
  && apk add postgresql-dev \
  # CFFI dependencies
  && apk add libffi-dev py-cffi

# Requirements are installed here to ensure they will be cached.
COPY pyproject.toml ./
RUN pip install --upgrade pip
RUN pip install poetry
RUN poetry install
