'use strict';
const { Router } = require("express");

module.exports = function (settings, state) {

    const router = new Router();

    router.get('/basicdata', (req, res) => {
        res.send({
            title: state.title,
            pages: state.pages,
            userConsts: state.userConsts,
            sysConsts: state.sysConsts,
            extraConsts: state.extraConsts
        })
    });

    router.post('/userconsts', async (req, res) => {
        let error = await state.setUserConsts(req.body);
        if (error) {
            res.status(400).send(error);
        }
        else {
            res.sendStatus(200);
        }
    })

    router.post('/renameboard/:newname', async(req,res) => {
        let error = await state.renameBoard( req.params.newname );
        if (error) {
            res.status(400).send(error);
        }
        else {
            res.sendStatus(200);
        }
    })

    router.post('/addpage/:pagename', async (req, res) => {
        let error = await state.addPage(req.params.pagename);
        if (error) {
            res.status(400).send(error);
        }
        else {
            res.sendStatus(200);
        }
    })

    router.post('/renamepage/:oldname/:newname', async (req, res) => {
        let error = await state.renamePage(req.params.oldname, req.params.newname);
        if (error) {
            res.status(400).send(error);
        }
        else {
            res.sendStatus(200);
        }
    })

    router.delete('/page/:pagename', async (req, res) => {
        let error = await state.removePage(req.params.pagename);
        if (error) {
            res.status(400).send(error);
        }
        else {
            res.sendStatus(200);
        }
    })

    router.post('/movecell/:pagename/:cellid/:movetocellid', async (req, res) => {

        let error = await state.moveCell(req.params.pagename, req.params.cellid, req.params.movetocellid);
        if (error) {
            res.status(400).send(error);
        }
        else {
            res.sendStatus(200);
        }
    })

    router.post('/updatecell/:pagename/:cellid', async (req, res) => {

        let error = await state.updateCell(req.params.pagename, req.params.cellid, req.body);
        if (error) {
            res.status(400).send(error);
        }
        else {
            res.sendStatus(200);
        }
    })

    router.post('/updatecellcontent/:pagename/:cellid', async (req, res) => {
        let error = await state.updateCellContent(req.params.pagename, req.params.cellid, req.body.content);
        if (!error) {
            res.sendStatus(200);
        }
        else {
            res.status(400).send(error);
        }
    })

    router.post('/addcell/:pagename/:type', async (req, res) => {
        let error = await state.addCell(req.params.pagename, req.query.name, req.params.type);
        if (!error) {
            res.sendStatus(200);
        }
        else {
            res.status(400).send(error);
        }
    });

    router.post('/removecell/:pagename/:cellid', async (req, res) => {
        let error = await state.removeCell(req.params.pagename, req.params.cellid);
        if (!error) {
            res.sendStatus(200);
        }
        else {
            res.status(400).send(error);
        }
    })

    router.post('/reset', async (req, res) => {
        // reload state from disk
        await state.reset();
        res.sendStatus(200);
    })

    return router;
}