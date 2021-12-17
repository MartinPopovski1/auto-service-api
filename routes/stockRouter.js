const express = require('express');
const stockController = require('../controllers/stockController')

function routes(AutoPart) {
    const stockRouter = express.Router();
    const controller = stockController(AutoPart)
    stockRouter.route('/')
        .post(controller.post)
        .get(controller.getAll);


    stockRouter.use('/:autoPartId', (req, res, next) =>  {
        AutoPart.findById(req.params.autoPartId, (err, autoPart) => {
            if(err) {
                return res.send(err);
            }
            if(autoPart) {
                req.autoPart = autoPart;
                return next();
            }
            return res.sendStatus(404);
        });
    });
    stockRouter.route('/:autoPartId')
        .get((req, res) => res.json(req.autoPart))
        .put((req , res) => {
            const { autoPart } = req;
            autoPart.name = req.body.name;
            autoPart.brand = req.body.brand;
            autoPart.quantity = req.body.quantity;
            autoPart.purchasePrice = req.body.purchasePrice;
            req.autoPart.save((err) => {
                if(err) {
                    return res.send(err)
                }
                return res.json(autoPart)
            })
        })
        .patch((req, res) => {
            const { autoPart } = req;

            if(req.body._id) delete req.body._id;
            Object.entries(req.body).forEach(item => {
                const key  = item[0];
                const value = item[1];
                autoPart[key] = value;
            })
            req.autoPart.save((err) => {
                if(err) {
                    return res.send(err)
                }
                return res.json(autoPart)
            })
        })
        .delete((req, res) => {
            req.autoPart.remove((err) => {
                if(err) return res.send(err)
                return res.sendStatus(204);
            })
        })

    return stockRouter;
}

module.exports = routes;
