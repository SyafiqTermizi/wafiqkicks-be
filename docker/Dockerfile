FROM python:3.9.1-slim-buster

ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update \
  # dependencies for building Python packages
  && apt-get install -y build-essential \
  # psycopg2 dependencies
  && apt-get install -y libpq-dev \
  # cleaning up unused files
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
RUN pip install --upgrade pip
RUN pip install poetry
RUN poetry install && rm pyproject.toml
