#DevTinder APIs

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter
- POST /request/send/intrested/:userId
- POST /request/send/ignore/:userId
- post / request/send/:status/:userId

- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId
- post /request/review/:stauts/:userId

userRouter  
- GET /user/connections => show that who accepted my request
- GET /user/requests/received
- GET /user/feed -gets you the profile of all other users

Status : ignore, intrested,accepted, rejected
