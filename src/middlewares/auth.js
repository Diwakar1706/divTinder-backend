    const adminAuth=(req,res,next)=>{
          console.log("admin auth is getting checked!!")
          const token="xyz";
          const isAdminAuthorized=token;
          if(!isAdminAuthorized){
             res.status(401).send("unauthorized request")
          }
          else{
             next();
    
          }

    }
    module.exports={adminAuth}
    
  