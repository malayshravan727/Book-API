const Router = require("express").Router();

const AuthorModel = require("../../database/author");

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ authors: getAllAuthors });
});

/* 
     Route         /specific
     Description   to get specific author 
     Access        PUBLIC
     Parameters    id
     Method        GET
*/   
Router.get("/specific/:id",async(req,res)=>
{
  const getAuthorById = await AuthorModel.find({id:parseInt(req.params.id)})
  if(!getAuthorById)
  {
      return res.json({error:`No such author with id : ${req.params.id} was found `});
  }
  return res.json({authors_by_id : getAuthorById });
});

/*
  Route           /author
  Description     get a list of authors based on a book's ISBN
  Access          PUBLIC
  Parameters      isbn
  Method          GET
  */
Router.get("/:isbn", async (req, res) => {
  try {
    const getSpecificAuthors = database.authors.filter((author) =>
      author.books.includes(req.params.isbn)
    );

    if (getSpecificAuthors.length === 0) {
      return res.json({
        error: `No author found for the book ${req.params.isbn}`,
      });
    }

    return res.json({ authors: getSpecificAuthors });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
Router.post("/new", (req, res) => {
  const { newAuthor } = req.body;

  AuthorModel.create(newAuthor);

  return res.json({ message: "author was added!" });
});

/* 
     Route         /author/name/update    
     Description   to update Author name using id     
     Access        PUBLIC
     Parameters    id
     Method        PUT
*/ 
Router.put("/name/update/:id",async(req,res)=>
{
    try{
    const updatedAuthorName = await AuthorModel.findOneAndUpdate(
        {
          id:req.params.id,
        },
        {
            name:req.body.newNameOfAuthor,
        },
        {
            new:true,
            runValidators:true,
        },
    );
     return res.json({author:updatedAuthorName,message:"Name of the author was successfully updated"});
    }
    
     catch (error)
     {
         return res.json({error:error.message});
     }
});

/* 
     Route         /author/delete
     Description   to delete an author 
     Access        PUBLIC
     Parameters    id
     Method        DELETE
*/     
Router.delete("/delete/:id",async(req,res)=>
{ 
     
    const updatedAuthorDatabase= await AuthorModel.findOneAndDelete(
        {
          id:req.params.id,    
        },
        
    );
     return res.json({authors:updatedAuthorDatabase});
    
});

module.exports = Router;