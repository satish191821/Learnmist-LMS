import app from "./app.js"
import connectDb from "./configs/db.js"

let port = process.env.PORT || 8000

connectDb().then(() => {
  app.listen(port, () => {
    console.log("Server Started");
  });
});


