import { House } from "../models/house.js";

async function index(req, res) {
  try {
    const user = req.session.user;
    const houses = await House.find({});

    const favHouses = houses.filter((house) => {
      if(house.reviews){
      return (
        house.addedBy.equals(user?._id) &&
        house.visited === "Yes" &&
        house.reviews.rating >= 3 &&
        house.price >= user.minPrice &&
        house.price <= user.maxPrice
      );
    }
    });

    const budgetHouses = houses.filter((house) => {
      return (
        house.addedBy.equals(user?._id) &&
        house.visited === "Yes" &&
        house.price >= user.minPrice &&
        house.price <= user.maxPrice
      );
    });

    const threePlusRatingHouses = houses.filter((house) => {
      if(house.reviews){
      return (
        house.addedBy.equals(user?._id) &&
        house.visited === "Yes" &&
        house.reviews.rating >= 3
      );
    }
    });

    res.render("wishlist/index", {
      budgetHouses,
      threePlusRatingHouses,
      favHouses,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/houses");
  }
}
export { index };
