# Poker Planner
> Backend project for the poker planner project and developed using Django 2.2

Poker Planner is a fun way of efficiently planning sprints, and a platform where users can come
and give their estimates on tickets and participate in poker planning process. This is the backend
for the project.

## Prerequisites
Before you start, make sure you have the following installed on your system:

* Python (3.8.10 version)
* pip (Python package manager)
* PostgreSQL (12 version)

## Installation
1. Install Python and pip
  ```
  sudo apt-get update
  sudo apt-get install python-pip
  ```
2. Install Postgresql
  ```
  sudo apt-get install postgresql postgresql-contrib.
  ```
3. Create database for your project
  ```
  psql -U postgres
  create database <database_name>
  ```
4. Clone git repositry into your local
  ```
  git@github.com:jtg-induction/Team---7-BE-PokerPlanner.git
  ```
5. Install venv in your system
  ```
  sudo pip install virtualenv
  ```
6. Make a new virtual env
  ```
  mkvirtualenv <env_name>
  ```
7. Workon the newly created env
  ```
  workon <env_name>
  ```
8. Go into the poject directory and run this command to install all the dependencies
  ```
  pip install -r requirements.txt
  ```
9. Set up your environment variables and run the command to migrate the models to your database
  ```
  python manage.py migrate
  ```

## Usage
To start the development server, run the following command:

`python manage.py runserver`

Then open your web browser and go to http://127.0.0.1:8000/ to see your Django project running.

Then start redis service by running the following command

`/etc/init.d/redis-server start`

Then start the celery using the following command

`python -m celery -A <project_name> worker -l info`

## Testing
To run the tests for your project, use the following command:

`python manage.py test`

This will run all the tests in the project.
