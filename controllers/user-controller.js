const User = require ('../models/User');
const Thought = require('../models/Thought')
const userController = {
    getAllUsers(req, res){
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select:['-__v', '-thoughts', '-friends', '-FriendCount']
        })
        .select('-__v')
        .sort({_id: -1})
        .then(userData => res.json(userData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },
    getUserById ({params}, res){
        User.findOne({_id: params.id})
        .populate({
           path: 'thoughts',
           select: '-__v'
        })
        .populate({
            path: 'friends',
            select: ['-__v', '-thoughts', '-friends', '-FriendCount']
        })
        .then(dbData => {
            if(!dbData){
                res.status(400).json({message: 'no user found with this id!'})
                return
            }
            res.json(dbData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },
    createUser ({ body }, res){ 
        User.create(body)
        .then(dbData => res.json(dbData))
    },
    updateUser({params, body}, res){
        User.findByIdAndUpdate({_id: params.id}, body, {new:true})
        .then(dbData => {
            if(!dbData){
                res.status(404).json({message: 'no user found with this id'})
                return;
            }
            res.json(dbData)
        })
        .catch(err => res.status(400).json(err))
        
    },
    deleteUser({ params }, res){
        User.findOneAndDelete({_id: params.id})
        .then(dbData => {
            if(!dbData){
                res.status(404).json({message: 'no user found with this id'})
            }
            res.json(dbData)
        })
        .catch(err => res.status(400).json(err))
    },
    addFriend({ params }, res){
        User.findOneAndUpdate(
            {_id: params.userId},
            {$addToSet: {friends: params.friendId}},
            {new: true}
        ).then(dbData => {
            if(!dbData){
                res.status(404).json({message: 'No user found with this id'})
            }
            res.json(dbData)
        })
       
    },
    removeFriend({params}, res){
        User.findOneAndUpdate(
            {_id: params.userId},
            {$pull: {friends: params.friendId}},
            {new: true}
        ).then(dbData => {
            if(!dbData){
                res.status(404).json({message:'No user with this id'});
               return
            }
            res.json(dbData)
        })
        .catch(err => res.status(400).json(err))
    }
}

module.exports = userController;