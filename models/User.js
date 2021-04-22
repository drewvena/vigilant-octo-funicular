const {Schema, model} = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema ({
 username: {
     type: String,
     required: true,
     trim: true
 },
 email: {
     type: String,
     required: true,
     unique: true,
     match:[/.+@.+\..+/]
 },
 thoughts: [
     {
         type: Schema.Types.ObjectId,
         ref: 'Thought'
     }
 ],
 friends: [
     {
         type: Schema.Types.ObjectId,
         ref: 'User'
     }
 ]
     
 
},
{
    toJSON: {
        virtuals: true,
        getters: true
    }
}
);

UserSchema.virtual('FriendCount').get(function(){
    if(!this.friends) {
        return 0
    }
    return this.friends.length
})

const User = model ('User', UserSchema);

module.exports = User;