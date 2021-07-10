const Router = require("express").Router();

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", (req, res) => {
  return res.json({ publications: database.publications });
});

/* 
     Route         /publications/by
     Description   to get specific publication       
     Access        PUBLIC
     Parameters    id
     Method        GET
*/   
Router.get("/by/:id",async(req,res)=>
{
    const getPublicationById = await PublicationModel.findOne({id:parseInt(req.params.id)});

    if(!getPublicationById)
    {
        return res.json({error: `No publication found at id : ${req.params.id}`});
    }
    return res.json({publication_by_id : getPublicationById});
});

/* 
     Route         /publications
     Description   to get a list of publications based on a book       
     Access        PUBLIC
     Parameters    book
     Method        GET
*/   
Router.get("/:book",async(req,res)=>
{
    const getPublicationByBook = await PublicationModel.find({books:req.params.book});
    if(getPublicationByBook.length===0)
    {
        return res.json({Error:`No such publication was found for the book having isbn: ${req.params.book}`});
    }
    return res.json({Publication_using_book : getPublicationByBook });
});

/* 
     Route         /add/new
     Description   to add new publication      
     Access        PUBLIC
     Parameters    None
     Method        POST
*/   
Router.post("/add/new", async (req,res)=>
{
    try
    {
    const {newPublication} = req.body;                                                       

    const addNewPublication=await PublicationModel.create(newPublication)

    return res.json({message:"publication was added!"});
    }
    catch (error)
    {
        return res.json({error:error.message});
    }
});

/* 
     Route         /publications/name/update       
     Description   to update publication name using id     
     Access        PUBLIC
     Parameters    id
     Method        PUT
*/ 
Router.put("/name/update/:id",async(req,res)=>
{
    try
    {
    const updatedPublicationName = await PublicationModel.findOneAndUpdate(
        {
          id:req.params.id,
        },
        {
            name:req.body.newNameOfPublication,
        },
        {
            new:true,
            runValidators:true,
        },
    )
     return res.json({publication:updatedPublicationName,message:"Name of the publication was successfully updated"});
    }
    catch (error)
    {
        return res.json({error:error.message});
    }
});

/*
  Route           /publications/update/book
  Description     update/add new book to a publication
  Access          PUBLIC
  Parameters      isbn
  Method          PUT
  */
Router.put("/update/book/:isbn", (req, res) => {
  // update the publication database
  database.publications.forEach((publication) => {
    if (publication.id === req.body.pubId) {
      return publication.books.push(req.params.isbn);
    }
  });

  // update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
    message: "Successfully updated publication",
  });
});

/*
  Route           /publication/delete/book
  Description     delete a book from publication 
  Access          PUBLIC
  Parameters      isbn, publication id
  Method          DELETE
  */
Router.delete("/delete/book/:isbn/:pubId", (req, res) => {
  // update publication database
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );

      publication.books = newBooksList;
      return;
    }
  });

  // update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0; // no publication available
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
  });
});

/* 
     Route         /publications/delete
     Description   to delete a publication   
     Access        PUBLIC
     Parameters    id
     Method        DELETE   
*/     
Router.delete("/delete/:id",async(req,res)=>
{ 
     const updatedPublicationDataBase = await PublicationModel.findOneAndDelete(
         {
             id:req.params.id,
         },
     );
     
     return res.json({message:"publication was deleted"});
});

module.exports = Router;