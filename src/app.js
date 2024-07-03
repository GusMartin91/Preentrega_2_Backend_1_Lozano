import express from "express";
import productsRouter from './router/product.router.js';
import cartsRouter from './router/cart.router.js';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

app.use('/api', productsRouter);
app.use('/api', cartsRouter);

app.use('/',(req,res)=>{
    res.send('asdasdasd')
})

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

