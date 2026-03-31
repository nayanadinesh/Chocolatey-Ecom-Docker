// ------------------------------------------------------------------------------------------------
// This file is used to import sample products and users data into the database
// Note: The product images are uploaded to cloudinary and their links are stored in the database.
// ------------------------------------------------------------------------------------------------

import mongoose from "mongoose";
import userData from "./Data/users.js";
import productData from "./Data/products.js";
import dotenv from "dotenv";
import User from "./Models/UserModels.js";
import Order from "./Models/OrderModels.js";
import Product from "./Models/ProductModels.js";
import ConnectDB from "./config/DB.js";

dotenv.config();

// ✅ Wait for DB connection before doing anything
const start = async () => {
  await ConnectDB(); // Wait for connection to complete

  // Import users and products data
  const importData = async () => {
    try {
      await Order.deleteMany();
      await Product.deleteMany();
      await User.deleteMany();

      const createdUserArray = await User.insertMany(userData);
      const adminUser = createdUserArray[0]._id;

      const sampleProductArray = productData.map((product) => {
        return { ...product, user: adminUser };
      });

      await Product.insertMany(sampleProductArray);

      console.log("Data imported successfully".green.inverse);
      process.exit();
    } catch (error) {
      console.error(`${error}`.red.inverse);
      process.exit(1);
    }
  };

  // Delete all users and products data
  const destroyData = async () => {
    try {
      await Order.deleteMany();
      await Product.deleteMany();
      await User.deleteMany();

      console.log("Data destroyed successfully !!".red.inverse);
      process.exit();
    } catch (error) {
      console.error(`${error}`.red.inverse);
      process.exit(1);
    }
  };

  if (process.argv[2] === "-d") await destroyData();
  else await importData();
};

start(); // ✅ Execute main function
