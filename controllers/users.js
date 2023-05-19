const Users = require('../models/users')
module.exports.register = async (req,res)=>{
    try{
        const{username,password,email} = req.body;
        const newuser = new Users({email,username});
        const registeredUser = await Users.register(newuser,`${password}`);
        req.login(registeredUser,err=>{
            if(err) next(err)
            req.flash('success','Registration successfull..')
            res.redirect('/campgrounds')})
    }
    catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
    
}

module.exports.login = async (req,res)=>{
    req.flash('success', `welcome back ${req.user.username}`)
    const url = res.locals.url || '/campgrounds'
    console.log(url)
    res.redirect(url)
}

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','ByeBye')
        res.redirect('/login')
    })
    
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.renderRegister = (req,res)=>{
    res.render('users/register')

}

