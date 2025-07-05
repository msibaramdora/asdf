import { app } from "./app.js";

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is runing at port : ${process.env.PORT}`);
});
