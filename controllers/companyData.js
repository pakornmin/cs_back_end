const express = require('express');
const router = express.Router();
const CompanyData = require('../models/CompanyData');
const Url = require('../models/Url');
require('dotenv').config();


/**
 * @swagger
 * components:
 *   schemas:
 *     CompanyData:
 *       type: object
 *       required:
 *         - name
 *         - url
 *         - total
 *         - contributions
 *         - top_three
 *       properties:
 *         name:
 *           type: string
 *           description: a company's name
 *         url:
 *           type: string
 *           description: a company's url
 *         total:
 *           type: number
 *           description: a company's total donation to climate deniers
 *         contributions:
 *           type: array
 *           items: number
 *           description: a company's donation to each climate denier
 *         
 */

/**
  * @swagger
  * tags:
  *   name: Company Data
  *   description: The API for managing Compay Data
  */



/**
 * @swagger
 * /companyData/getAllCompanies:
 *   get:
 *     summary: Get every company's data
 *     tags: [Company Data]
 *     responses:
 *       200:
 *         description: every company's data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/CompanyData'
 *       400:
 *         description: Bad request
 */
//get all companies
router.get('/getAllCompanies', async (req, res) => {
    try {
        const companies = await CompanyData.find();
        res.json(companies);
    } catch(err) {
        res.status(400).json({message: "cannot get all companies"});
    }
});



/**
 * @swagger
 * /companyData/postOneCompany:
 *   post:
 *     summary: Create a new company
 *     tags: [Company Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                company:
 *                  $ref: '#/components/schemas/CompanyData'
 * 
 *     responses:
 *       200:
 *         description: The company was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyData'
 *       400:
 *         description: password incorrect/ unable to create a company
 */
//post one company
router.post('/postOneCompany', async (req, res) => {

    if(req.body.password === process.env.password) {
        const company = new CompanyData({
                name: req.body.company.name, 
                url: req.body.company.url,
                iconPath: req.body.company.iconPath,
                category: req.body.company.category,
                total: req.body.company.total,
                contributions: req.body.company.contributions,
                top_three: req.body.company.top_three
        });

        try {
            const existedUrl = await Url.findOne({url: req.body.company.url})
            if(!existedUrl) {
                const url =  new Url({
                    url: req.body.company.url
                });
                const savedUrl = await url.save();
                const savedCompany = await company.save();
                res.json({newUrl: savedUrl, savedCompany: savedCompany})
            }
            else {
                const savedCompany = await company.save();
                res.json(savedCompany);
            }
        } catch(err) {
            res.status(400).json({message: 'cannot create a company: incorrect input'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }

})


/**
 * @swagger
 * /companyData/postManyCompanies:
 *   post:
 *     summary: Create multiple companies
 *     tags: [Company Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                companies:
 *                  type: array
 *                  items: 
 *                      $ref: '#/components/schemas/CompanyData'
 * 
 *     responses:
 *       200:
 *         description: The companies were successfully created
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items: 
 *                  $ref: '#/components/schemas/CompanyData'
 *       400:
 *         description: password incorrect/ unable to create a company
 */
//post multiple companies
router.post('/postManyCompanies', async (req, res) => {
    if(req.body.password === process.env.password) {
        const companies = req.body.companies;
        const insertedUrls = [];
        const insertedCompanies = [];
        try {
            const length = companies.length;
            for(let i = 0; i < length; i++) {
                const company = new CompanyData({
                    name: companies[i].name, 
                    url: companies[i].url,
                    iconPath: companies[i].iconPath,
                    category: companies[i].category,
                    total: companies[i].total,
                    contributions: companies[i].contributions,
                    top_three: companies[i].top_three
                });
                const existedUrl = await Url.findOne({url: companies[i].url})
                if(!existedUrl) {
                    const url =  new Url({
                        url: companies[i].url
                    });
                    const savedUrl = await url.save();
                    const savedCompany = await company.save();
                    insertedCompanies.push(savedCompany);
                    insertedUrls.push(savedUrl);
                }
                else {
                    const savedCompany = await company.save();
                    insertedCompanies.push(savedCompany);
                }
            }
            res.json({insertedCompanies: insertedCompanies, insertedUrls: insertedUrls});
        } catch(err) {
            res.status(400).json({message: 'cannot create a company: incorrect input'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})




/**
 * @swagger
 * /companyData/getOneCompany/{url}:
 *   get:
 *     summary: Get one company's political data
 *     tags: [Company Data]
 *     parameters:
 *       - in: path
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: The company's domain
 *     responses:
 *       200:
 *         description: the company's info is retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyData'
 *       400:
 *         description: url does not exist in the database
 */
//get one company by url
router.get('/getOneCompany/:url', async (req, res) => {
    try {
        const foundCompany = await CompanyData.findOne({url: req.params.url});
        res.json(foundCompany);
    } catch(err) {
        res.status(400).json({message: "url does not existed"});
    }
})



/**
 * @swagger
 * /companyData/deleteOneCompany:
 *   delete:
 *     summary: delete a new company
 *     tags: [Company Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                url:
 *                  type: string
 * 
 *     responses:
 *       200:
 *         description: The company was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyData'
 *       400:
 *         description: password incorrect/ unable to delete a company
 */
//delte one company by url
router.delete('/deleteOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const company = await CompanyData.deleteOne({url: req.body.url});
            res.json(company);
        } catch(err) {
            res.status(400).json({message: "url does not existed"});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})




/**
 * @swagger
 * /companyData/updateOneCompany:
 *   patch:
 *     summary: upsert a new company
 *     tags: [Company Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                company:
 *                  $ref: '#/components/schemas/CompanyData'
 * 
 *     responses:
 *       200:
 *         description: The company was successfully upserted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyData'
 *       400:
 *         description: password incorrect/ unable to upsert a company
 */
//update one company by url
router.patch('/updateOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const upsertedCompany = await CompanyData.findOneAndUpdate(
                {url: req.body.url}, 
                { $set: {
                            name: req.body.company.name,
                            url: req.body.url,
                            total: req.body.company.total,
                            contributions: req.body.company.contributions,
                            top_three: req.body.company.top_three
                }},
                { upsert: true, new: true }
                );
            res.json(upsertedCompany);
        } catch(err) {
            res.status(400).json({message: 'cannot upsert a company'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})






/**
 * @swagger
 * /companyData/updateManyCompanies:
 *   patch:
 *     summary: upsert multiple companies
 *     tags: [Company Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                companies:
 *                  type: array
 *                  items: 
 *                      $ref: '#/components/schemas/CompanyData'
 * 
 *     responses:
 *       200:
 *         description: The companies were successfully upserted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                 $ref: '#/components/schemas/CompanyData'
 *       400:
 *         description: password incorrect/ unable to upsert a company
 */
//update many companies
router.patch('/updateManyCompanies', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const companies = req.body.companies;
            const length = companies.length;
            const insertedUrls = [];
            const upsertedCompanies = [];
            for(let i = 0; i < length; i++) {
                const existedUrl = await Url.findOne({url: companies[i].url})
                if(!existedUrl) {
                    const url =  new Url({
                        url: companies[i].url
                    });
                    const savedUrl = await url.save();
                    const upsertedCompany = await CompanyData.findOneAndUpdate(
                        {url: companies[i].url}, 
                        { $set: {
                            name: companies[i].name, 
                            url: companies[i].url,
                            total: companies[i].total,
                            contributions: companies[i].contributions,
                            top_three: companies[i].top_three
                        }},
                        { upsert: true, new: true }
                    );
                    upsertedCompanies.push(upsertedCompany);
                    insertedUrls.push(savedUrl);
                }
                else {
                    const upsertedCompany = await CompanyData.findOneAndUpdate(
                        {url: companies[i].url}, 
                        { $set: {
                            name: companies[i].name, 
                            url: companies[i].url,
                            total: companies[i].total,
                            contributions: companies[i].contributions,
                            top_three: companies[i].top_three
                        }},
                        { upsert: true, new: true }
                    );
                    upsertedCompanies.push(upsertedCompany);
                }
            }
            res.json({upsertedCompanies: upsertedCompanies, insertedUrls: insertedUrls});
        } catch(err) {
            res.status(400).json({message: 'cannot upsert a company'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
});





/**
 * @swagger
 * /companyData/deleteAllCompanies:
 *   delete:
 *     summary: delete all company
 *     tags: [Company Data]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *     
 * 
 *     responses:
 *       200:
 *         description: All company were successfully deleted
 *       400:
 *         description: password incorrect
 */
//delete all companies
router.delete('/deleteAllCompanies', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const deletedCompanies = await CompanyData.deleteMany({});
            res.json(deletedCompanies);
        } catch(err) {
            res.status(400).json({message: 'cannot delete companies'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
});



router.get('/getByCategory/:category', async (req, res) => {
    try {
        const foundCompanies = await CompanyData.find({category: req.params.category});
        res.json(foundCompanies);
    } catch(err) {
        res.status(400).json({message: 'cannot delete companies'});
    }
});



router.patch('/updateIconUrlAndCategoryAll', async (req, res) => {
    if(req.body.password === process.env.password) {
        const companies = await CompanyData.find();
        const length = companies.length;
        const updateCompanies = [];
        //console.log(companies[41]);
        for(let i = 0; i < length; i++){
            try {
                if(companies[i].url !== '') {
                    //console.log(req.body.url)
                    const httpUrl = `http://localhost:8080/allInfo/getOneCompany/` + companies[i].url;
                    //console.log(httpUrl);
                    const psInfo = await fetch(httpUrl, {
                        method: "GET"
                    });
                    //console.log('psInfo', psInfo);
                    if(i==41) {
                        console.log(httpUrl);
                        console.log('psInfo', psInfo);
                    }
                    if(psInfo) {
                        const jsonPsInfo = await psInfo.json();
                        //console.log('jsonPsInfo', jsonPsInfo);
                        //console.log(jsonPsInfo.iconPath);
                        companies[i].iconPath = jsonPsInfo.iconPath;
                        companies[i].category = jsonPsInfo.category;
                        const updateCompany = await companies[i].save();
                        updateCompanies.push(updateCompany);      
                    }
                }
            } catch(err) {
                console.log('i: ', i, err);
                res.status(400).json({message: 'cannot upsert a company'});
            }
        }
        res.json(updateCompanies);
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
});


router.patch('/updateIconUrlAndCategory', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            //console.log(req.body.url)
            const httpUrl = `http://localhost:8080/allInfo/getOneCompany/` + req.body.url;
            //console.log(httpUrl);
            const psInfo = await fetch(httpUrl, {
				method: "GET"
			});
            //console.log('psInfo', psInfo);
            const jsonPsInfo = await psInfo.json();
            //console.log('jsonPsInfo', jsonPsInfo);
            //console.log(jsonPsInfo.iconPath);
            const upsertedCompany = await CompanyData.findOneAndUpdate(
                {url: req.body.url}, 
                { $set: {
                    iconPath: jsonPsInfo.iconPath,
                    category: jsonPsInfo.category
                }},
                { upsert: true, new: true }
                );
            res.json(upsertedCompany);
        } catch(err) {
            console.log(err);
            res.status(400).json({message: 'cannot upsert a company'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
});


router.patch('/updateShopStatus', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const allCompanies = await CompanyData.find({});
            const savedCompanies = [];
            for(let i = 0; i < allCompanies.length; i++) {
                const totalContribution = allCompanies[i].total
                console.log(allCompanies[i].total);
                if(totalContribution > 500000) {
                    allCompanies[i].shopStatus = 'NO';
                } else if(totalContribution > 100000) {
                    allCompanies[i].shopStatus = 'OK';
                } else {
                    allCompanies[i].shopStatus = 'YES';
                }
                allCompanies[i].save();
                //console.log(allCompanies[i]);
                savedCompanies.push(allCompanies[i]);
            }


            
            res.json(allCompanies)

        } catch(err) {
            console.log(err);
            res.status(400).json({message: 'cannot update a company'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
});

module.exports = router;