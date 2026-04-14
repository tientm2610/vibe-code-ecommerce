import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.route';
import cartRouter from './routes/cart.route';
import orderRouter from './routes/order.route';
import productRouter from './routes/product.route';
import homeRouter from './routes/home.route';
import adminRouter from './routes/admin.route';
import { errorHandler } from './middleware/error-handler';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/home', homeRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/admin', adminRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});