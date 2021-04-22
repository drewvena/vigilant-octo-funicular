const User = require('../models/User');
const Thought = require('../models/Thought')

const thoughtController = {
    getAllThoughts(req, res){
        Thought.find({})
    .populate({ path: 'reactions', select: '-__v'})
    .select('-__v')
    .then(dbData => res.json(dbData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
},
   getThoughtById({params}, res){
       Thought.findOne({_id: params.id})
       .populate({path: 'reactions', select:'-__v'})
       .select('-__v')
       .then(dbData => {
           if (!dbData){
               res.status(404).json({message: 'No thought found with this id'})
               return;
           }
           res.json(dbData)
       })
       .catch(err => {
           console.log(err)
           res.status(400).json(err)
       })
   },
   createThought({ body }, res) {
    Thought.create(body)
    .then(dbData => {
        User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thoughts: dbData._id } },
            { new: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'no user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    })
    .catch(err => res.status(400).json(err));
},
updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true }
    )
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'no thought found with this id' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
},
deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
    .then(dbData => {
        if (!dbData) {
            res.status(404).json({ message: 'no thought found with this id!'});
            return;
        }
        User.findOneAndUpdate(
            { username: dbData.username },
            { $pull: { thoughts: params.id } }
        )
        .then(() => {
            res.json({message: 'Thought deleted!'});
        })
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
},
addReaction({ params, body}, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $addToSet: { reactions: body } },
        { new: true, runValidators: true }
    )
    .then(dbData => {
        if (!dbData) {
            res.status(404).json({ message: 'no thought found with this id' });
            return;
        }
        res.json(dbData);
    })
    .catch(err => res.status(500).json(err));
},
deleteReaction({ params} , res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions:  {_id: params.reactionId}} },
        { new: true, runValidators: true }
    )
    .then(dbData => {
        if (!dbData) {
            res.status(404).json({ message: 'no thought found with this id' });
            return;
        }
        res.json({message: 'Reaction deleted!'});
    })
    .catch(err => res.status(500).json(err));
},
}

module.exports = thoughtController