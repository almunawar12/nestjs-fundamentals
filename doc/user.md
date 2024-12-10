# User Api Spec

## Register User

Endpoint :POST /api/users

Request Body :

```json
{
  "username": "almunawar",
  "password": "password",
  "name": "Almunawar"
}
```

Response Body (success) :

```json
{
  "data": {
    "username": "almunawar",
    "name": "Almunawar"
  }
}
```

Response Body (failed) :

```json
{
  "errors": "username already registered"
}
```

## Login User

## Get user

## Update User

## Logout user
