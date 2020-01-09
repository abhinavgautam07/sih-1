const Items = require('../models/item');
const Users = require('../models/User');
module.exports.upload = (req, res) => {
    if (req.user.isFarmer == true) {

        Items.uploadedImage(req, res, async function (err) {

            try {
                if (err) {
                    console.log("multer error");
                    return;
                }
                if (!req.file) {
                    console.log("image not uploaded");
                    return;
                } else {
                    let newItem = await Items.create({
                        title: req.body.item_name,
                        farmer: req.user._id,
                        price: req.body.price
                    });
                    newItem.image = `${Items.imagePath}/${req.file.filename}`;
                    (await newItem).save();

                    if (req.xhr) {
                        console.log("uploading via ajax")
                        return res.status(200).json({
                            data: {
                                item: newItem
                            },
                            message: "Item Uploaded!"
                        });

                    }
                    return res.redirect('back');
                }


            } catch (error) {
                console.log(error);
                return;
            }
        });
    }
}
module.exports.toggleCart = async (req, res) => {
    try {
        let user = await Users.findById(req.user._id);
        if (user.cart.includes(req.body.itemId)) {
            await user.update(req.user._id, { $pull: { cart: req.body.itemId } });

            return res.status(200).json({
                data: {
                    added: false
                }, message: "item removed"
            });

        } else {
            user.cart.push(req.body.itemId);
            return res.status(200).json({
                data: {
                    added: true
                }, message: "item added to cart"
            });
        }
    } catch (err) {
        console.log(err);
        return res.json(500, {
            data: {
                message: "internal server error"
            }
        });
    }
}