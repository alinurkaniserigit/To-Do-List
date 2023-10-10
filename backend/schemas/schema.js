//helpers
const TypeOfList = require("../helpers/list-type");
const Role = require("../helpers/role");
const Importancy = require("../helpers/importancy");

//authentication
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


//graphql
const graphql = require("graphql");
const { buildResolveInfo } = require("graphql/execution/execute");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

//get models
const User = require("../models/user");
const List = require("../models/list");
const listItem = require("../models/list-item");
const Group = require("../models/group");
const Log = require("../models/logs");
const BlockList = require("../models/blocklist");

require("dotenv").config();

//will work on the sending mail, it gave an error, couldn't send it

//const transporter = nodemailer.createTransport({
// service: "gmail",
// auth: {
//  user: 'todolist.noreply@gmail.com',
//   pass: '123456789aA.',
//  }
// });

//creating userType to return a user in queries or mutations
//this returns a type that includes
//name,email,password,role,all groups that user is attending, all lists that user is attending
const userType = new GraphQLObjectType({
  name: "user",
  fields: () => ({
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: GraphQLString },
    group: {
      type: new GraphQLList(groupType),
      resolve(parent, args) {
        return Group.find({users: parent.email });
      },
    },
    lists: {
      type: new GraphQLList(listType),
      resolve(parent, args) {
        return List.find({users: parent.email });
      },
    },
  }),
});

//creating groupType,
//returns name, mail of leader, mail of all users
const groupType = new GraphQLObjectType({
  name: "group",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    leadMail: { type: GraphQLString },
    users: {
      type: new GraphQLList(userType),
      resolve(parent, args) {
        return User.find({ groupNames: parent.name });
      },
    },
  }),
});

//creates a list type
const listType = new GraphQLObjectType({
  name: "list",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    group: { type: GraphQLString },
    description: { type: GraphQLString },
    //getting all items of list
    listItems: {
      type: new GraphQLList(listItemType),
      resolve(parent, args) {
        return listItem.find({ listID: parent._id }); //.populate().listName;
      },
    },
    //getting users of list
    users: {
      type: new GraphQLList(userType),
      resolve: async (parent, args) => {
        const list = await List.findById(parent.id);
        return await User.find({ email: list.users });
      },
    },
    //getting admins of list
    admins: {
      type: new GraphQLList(userType),
      resolve: async (parent, args) => {
        const list = await List.findById(parent.id);

        const users = await User.find({ email: list.admins });
        return users;
      },
    },
  }),
});

//listItem
const listItemType = new GraphQLObjectType({
  name: "listItem",
  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    importancy: { type: GraphQLString },
    isDone: { type: GraphQLBoolean },
    listID: { type: GraphQLString },
  }),
});

//logintoken
const loginTokenType = new GraphQLObjectType({
  name: "Token",
  fields: () => ({
    userID: { type: GraphQLID },
    email: { type: GraphQLString },
    token: { type: GraphQLString },
    name: { type: GraphQLString },
    groupNames: { type: new GraphQLList(GraphQLString) },
    listNames: { type: new GraphQLList(GraphQLString) },
    isAdmin: { type: GraphQLBoolean },
  }),
});

//logtype
/*const logType = new GraphQLObjectType({
    name:"Log",
    field:()=>({
        email:{type:GraphQLString},
        operation:{type:GraphQLString},
        time:{type:Date}
    })
})*/
/*
const blType = new GraphQLObjectType({
    name:"BL",
    field:()=>({
        email:{type:GraphQLString}
    })
})*/

//queries
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    //login query returns a loginToken
    login: {
      type: loginTokenType,
      //takes email and password
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const user = await User.findOne({ email: args.email });
        //if there isn't any user with given email return error
        if (!user) {
          return new Error("User not Found");
        } else {
          const isEqual = await bcrypt.compare(args.password, user.password); //hashing the password to store in database (security)
          if (!isEqual) {
            //logging the operation
            let logT = new Log({
              email: args.email,
              operation: "Entered Wrong Password",
              time: Date.now(),
            });
            logT.save();

            throw new Error("Wrong password");
          } else {
            //create a token to sign in it expires in 10 hours(10 hours is for development)
            const token = jwt.sign(
              {
                userID: user.id,
                email: user.email,
                name: user.name,
                groupNames: user.groupNames,
                listNames: user.listNames,
                isAdmin: user.isAdmin,
              },
              process.env.SECRET_KEY,
              { expiresIn: "10h" }
            );

            //log
            let logT = new Log({
              email: user.email,
              operation: "login",
              time: Date.now(),
            });
            logT.save();

            //return necessary things
            return {
              userID: user.id,
              email: user.email,
              name: user.name,
              groupNames: user.groupNames,
              listNames: user.listNames,
              isAdmin: user.isAdmin,
              token: token,
            };
          }
        }
      },
    },

    //get all the lists of current user
    //the commented part is to return only private lists
    getLists: {
      type: new GraphQLList(listType),
      resolve: async (parent, args, req) => {
        return await List.find({ users: req.email }); //,type:TypeOfList.Private})
      },
    },

    //get all the groups that current user is attending
    getGroups: {
      type: new GraphQLList(groupType),
      resolve: async (parent, args, req) => {
        return await Group.find({ users: req.email });
      },
    },

    //get list by given id
    getList: {
      type: listType,
      args: {
        listId: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const list = await List.findById(args.listId).populate("listItems");
        return list;
      },
    },

    //get lists of given group
    getListsOfGroup: {
      type: new GraphQLList(listType),
      args: {
        groupName: { type: GraphQLString },
      },
      resolve: async (parent, args, req) => {
        let logT = new Log({
          email: req.email,
          operation: `Get lists of group: ${groupName}`,
          time: Date.now(),
        });
        logT.save();
        return await List.find({ name: args.groupName });
      },
    },

    //get the groups that user is admin, to use in dropdown list
    getGroupsThatUserIsAdmin: {
      type: new GraphQLList(groupType),
      resolve: async (parent, args, req) => {
        return Group.find({ leadMail: req.email });
      },
    },
  },
});

//mutations for database post
const Mutation = new GraphQLObjectType({
  name: "MutationType",
  fields: {
    /*
            Register by name,email and password
            If user isn't existing returns error
            Sends a verification email to user
            If user doesn't accept that verification will expire in 1 day.
            Doesn't create the user, just sends mail
        */
    register: {
      type: loginTokenType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args, context) => {
        try {
          console.log(args);
          const existingUser = await User.findOne({ email: args.email });
          if (existingUser) {
            let logT = new Log({
              email: args.email,
              operation: `Fail, creating existing user`,
              time: Date.now(),
            });
            logT.save();
            throw new Error("User already exists");
          } else {
            const emailToken = jwt.sign(
              {
                email: args.email,
                name: args.name,
                password: args.password,
              },
              process.env.SECRET_KEY,
              {
                expiresIn: "1d",
              }
            );
            let pass = await bcrypt.hash(args.password, 10);
            let newUser = new User({
              name :args.name,
              email :args.email,
              password: pass,
              token : args.token,
            });
            newUser = await newUser.save();

            return { token: emailToken, user: newUser };
          }
        } catch (error) {
          console.log(error);
        }
      },
    },

    /*
            User gets the verification link as an e-mail
            If there is no such token returns error
            If token matches creates the user in the database
        */
    activateAccount: {
      type: userType,
      args: {
        token: { type: GraphQLString },
      },
      resolve: async (parent, args, req) => {
        if (args.token) {
          let decodedToken;
          try {
            decodedToken = jwt.verify(args.token, process.env.EMAIL_TOKEN);
          } catch (err) {
            return new Error("No match");
          }
          let logT = new Log({
            email: decodedToken.email,
            operation: `User created`,
            time: Date.now(),
          });
          logT.save();
          const hashedPassword = await bcrypt.hash(decodedToken.password, 16);
          let user = new User({
            email: decodedToken.email,
            name: decodedToken.name,
            password: hashedPassword,
          });
          return await user.save();
        } else {
          return new Error("Enter token");
        }
      },
    },
    //not using it rn
    updateUserInfo: {
      type: userType,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args, req) => {
        const user = User.find({ email: req.email });
        if (args.name !== null) {
          user.updateOne({ name: args.name });
        }
        if (args.password !== null) {
          const hashedPassword = await bcrypt.hash(args.password, 16);
          user.updateOne({ password: hashedPassword });
        }
        let logT = new Log({
          email: args.email,
          operation: `User info updated`,
          time: Date.now(),
        });
        logT.save();
        return await user;
      },
    },
    //create a list
    createList: {
      type: listType,
      args: {
        name: { type: GraphQLString },
        type: { type: GraphQLString },
        group: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve: async (parent, args, req) => {
        const user = await User.findOne({ email: req.email });
        //if there is a user
        if (user !== null) {
          //if list type is group
          if (args.type === "GROUP") {
            const leadCheck = await Group.find({
              leadMail: req.email,
              name: args.group,
            });
            //if requester is lead of the group
            if (leadCheck.length !== 0) {
              let logT = new Log({
                email: req.email,
                operation: `Created a list in ${args.group}`,
                time: Date.now(),
              });
              logT.save();

              //create the list object
              const group = await Group.findOne({ name: args.group });
              const list = new List({
                name: args.name,
                type: args.type,
                group: args.group,
                description: args.description,
                users: group.users,
                admins: req.email,
              });
              /*
                                Update the lists of users that are belonging to the given group 
                                and update the list table
                            */
              await User.updateMany(
                { email: group.users },
                { $addToSet: { listNames: args.name } }
              );
              return await list.save();
            }
            //if requester is not lead fail
            else {
              let logT = new Log({
                email: req.email,
                operation: `Fail, unauthorized to create a list in ${args.group}`,
                time: Date.now(),
              });
              logT.save();
              throw new Error(
                "Unauthorized, you aren't the admin of that group"
              );
            }
          }
          //if list is private directly update without any control
          else {
            let logT = new Log({
              email: req.email,
              operation: `Created private list`,
              time: Date.now(),
            });
            logT.save();
            const list = new List({
              name: args.name,
              users: req.email,
              admins: req.email,
              description: args.description,
            });
            await user.updateOne({ $addToSet: { listNames: args.name } });
            return await list.save();
          }
        } else {
          throw new Error("User not found");
        }
      },
    },

    /*
            create a group
            Update the user's groups
            save the group
        */
    createGroup: {
      type: groupType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: async (parent, args, req) => {
        const group = new Group({
          name: args.name,
          leadMail: req.email,
          users: req.email,
        });
        await User.findByIdAndUpdate(req.userID, {
          $addToSet: { groupNames: args.name },
        });
        await group.save();

        let logT = new Log({
          email: req.email,
          operation: `Created group: ${args.name}`,
          time: Date.now(),
        });
        logT.save();

        return await group;
      },
    },
    //using it by email verification
    removeUser: {
      type: userType,
      args: {
        token: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        let decodedToken;
        try {
          decodedToken = jwt.verify(args.token, process.env.EMAIL_TOKEN);
        } catch (err) {
          return new Error("No match");
        }

        if (decodedToken) {
          const user = await User.findOne({ email: decodedToken.email });

          if (user) {
            await List.updateMany(
              { users: decodedToken.email },
              { $pull: { users: decodedToken.email } }
            );
            await List.updateMany(
              { admins: decodedToken.email },
              { $pull: { admins: decodedToken.email } }
            );

            await Group.updateMany(
              { users: decodedToken.email },
              { $pull: { users: decodedToken.email } }
            );
            await Group.updateMany(
              { leadMail: decodedToken.email },
              { leadMail: null }
            );

            return await user.deleteOne({ email: decodedToken.email });
          } else {
            return new Error("Your account is not in the list");
          }
        } else {
          return new Error("Errrrr");
        }
      },
    },
    /*
            Delete a list
            if isn't group lead can't remove a group list
            if the list is private can
            updates all user's lists
            removes list indexes of that list
            removes the list
        */
    removeList: {
      type: userType,
      args: {
        listId: { type: GraphQLString },
      },
      resolve: async (parent, args, req) => {
        const list = await List.findById(args.listId);
        if (list) {
          if (list.type === "GROUP") {
            const group = await Group.findOne({ name: list.group });

            if (group.leadMail !== req.email) {
              return new Error(
                "Unauthorized, you must be lead of the group to delete this."
              );
            } else {
              await User.updateMany(
                { listNames: list.name },
                { $pull: { listNames: list.name } }
              );

              const liindex = listItem.find({ listID: args.listId });
              await liindex.deleteOne({ listID: args.listId });

              await list.deleteOne({ id: args.listId });
              let logT = new Log({
                email: req.email,
                operation: `Removed the list:  ${list.name}`,
                time: Date.now(),
              });

              logT.save();
              return await list;
            }
          } else {
            await User.updateMany(
              { listNames: list.name },
              { $pull: { listNames: list.name } }
            );

            const liindex = listItem.find({ listID: args.listId });
            await liindex.deleteOne({ listID: args.listId });

            await list.deleteOne({ id: args.listId });

            let logT = new Log({
              email: req.email,
              operation: `Removed the list:  ${list.name}`,
              time: Date.now(),
            });
            logT.save();
            return await list;
          }
        } else {
          return new Error("There is no list with that name!");
        }
      },
    },
    /*
            remove a list item
            from list, and the item directly
            can only do it if admin of the list.
        */
    removeListItem: {
      type: listItemType,
      args: {
        itemId: { type: GraphQLString },
      },
      resolve: async (parent, args, req) => {
        const adminCheck = await List.find({
          admins: req.email,
          listItems: args.itemId,
        });
        if (adminCheck.length !== 0) {
          const list = List.find({ listItems: args.itemId });
          await list.updateOne({ $pull: { listItems: args.itemId } });

          let logT = new Log({
            email: req.email,
            operation: `${req.email}, removed the list item ${args.itemId}`,
            time: Date.now(),
          });
          logT.save();

          return await listItem.findByIdAndDelete(args.itemId);
        } else {
          throw new Error("Unauthorized");
        }
      },
    },
    //add item to list with group leader control
    addListItem: {
      type: listItemType,
      args: {
        description: { type: GraphQLString },
        importancy: { type: GraphQLString },
        listID: { type: GraphQLString },
      },
      resolve: async (parent, args, req) => {
        const listM = await List.findById(args.listID);
        if (listM.type === "GROUP") {
          let adminCheck = await Group.find({
            leadMail: req.email,
            name: listM.group,
          });

          if (adminCheck.length !== 0) {
            let listE = new listItem({
              description: args.description,
              importancy: args.importancy,
              listID: args.listID,
            });

            await listM.updateOne({ $addToSet: { listItems: listE } });
            listE.save();

            let logT = new Log({
              email: req.email,
              operation: `Added list item to ${listM.name}`,
              time: Date.now(),
            });
            logT.save();

            return await listE;
          } else {
            throw new Error("Unauthorized");
          }
        } else {
          let listE = new listItem({
            description: args.description,
            importancy: args.importancy,
            listID: args.listID,
          });

          await listM.updateOne({ $addToSet: { listItems: listE } });
          listE.save();

          let logT = new Log({
            email: req.email,
            operation: `Added list item to ${listM.name}`,
            time: Date.now(),
          });
          logT.save();

          return await listE;
        }
      },
    },

    /*
            adding user to a given list
            if user already in list throw error
            if the current user is not admin give unauthorized error
            if email or list Id is invalid return error
            updates user
        */

    addUserToList: {
      type: userType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        listId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args, req) => {
        const isBlocked = await BlockList.find({ email: args.email });

        if (isBlocked.length > 0) {
          return new Error("This account is blocked");
        }

        let mailOptions = {
          from: "todolist.noreply@gmail.com",
          to: args.email,
          subject: "List invitation",
          text: `${req.email}, added you to a To'Do list.`,
        };

        let user = await User.findOne({ email: args.email });
        let list = await List.findById(args.listId);

        const deleteurl = `http://localhost:27017/delete-account/`;
        const signinurl = `http://localhost:27017/sign-in/`;

        if (!user) {
          const pw = crypto.randomBytes(12).toString("hex");
          const hashedPassword = await bcrypt.hash(pw, 16);
          user = new User({
            email: args.email,
            password: hashedPassword,
            name: args.email,
          });

          const emailToken = jwt.sign(
            {
              email: args.email,
              name: args.email,
              password: pw,
            },
            process.env.EMAIL_TOKEN,
            {
              expiresIn: "1d",
            }
          );

          mailOptions = {
            from: "todolist.noreply@gmail.com",
            to: args.email,
            subject: "List invitation",
            html: `<p>Welcome, <b>${req.email}</b>, added you to a To Do list.
                        <br/>Your account is automatically created. 
                        <br/>You can log in the website with your email address.
                        <br/>Your password is: ${pw}
                        <br/><br/>Delete my account and add me to block list: <br/> ${deleteurl}${emailToken}
                        <br/><br/>Sign in: ${signinurl}</p>
                        `,
          };

          await user.save();
        }

        if (list) {
          user = await User.findOne({ email: args.email });

          const adminCheck = await List.find({
            admins: req.email,
            _id: args.listId,
          });
          //check for admin
          if (adminCheck.length !== 0) {
            const isInList = await List.find({
              users: user.email,
              _id: args.listId,
            });

            //check for already in list
            if (isInList.length !== 0) {
              return new Error("User is already in the list");
            }
            //if list is private also add user as an admin
            if (list.type === TypeOfList.Private) {
              await list.updateOne({ $addToSet: { admins: args.email } });
            }

            await user.updateOne({ $addToSet: { listNames: list.name } });
            await list.updateOne({ $addToSet: { users: args.email } });

            transporter.sendMail(mailOptions, function (err, info) {
              if (err) {
                console.log(err);
                return;
              }
              console.log("Sent" + info.response);
            });

            let logT = new Log({
              email: req.email,
              operation: `Added user ${user.name} to list ${list.name} `,
              time: Date.now(),
            });
            logT.save();
            return await user;
          } else {
            let logT = new Log({
              email: req.email,
              operation: `Unauthorized to add user`,
              time: Date.now(),
            });
            logT.save();
            return new Error("Unauthorized");
          }
        } else {
          return new Error("enter valid user and list name ");
        }
      },
    },

    //adding user to a group
    //updating the users of group
    //updating groups of user
    addUserToGroup: {
      type: userType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        groupId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args, req) => {
        console.log("a");
        const isBlocked = await BlockList.find({ email: args.email });

        /*if(isBlocked){
                    return new Error("This account is blocked");
                }*/

        const user = await User.findOne({ email: args.email });
        const group = await Group.findById(args.groupId);

        const isInGroup = await Group.find({
          users: user.email,
          name: group.name,
        });

        if (isInGroup.length !== 0) {
          return new Error("User is already in the group");
        }

        if (!user) {
          return new Error("Enter a valid e-mail");
        } else if (!group) {
          return new Error("Enter a valid group");
        } else if (!group && !user) {
          return new Error("Enter a valid group and e-mail");
        } else {
          const adminCheck = await Group.find({
            leadMail: req.email,
            name: group.name,
          });

          if (adminCheck.length !== 0) {
            await user.updateOne({ $addToSet: { groupNames: group.name } });
            await group.updateOne({ $addToSet: { users: args.email } });
            const list = await List.find({ group: group.name });

            const names = list.map((item) => item.name);
            await user.updateOne({
              $addToSet: { listNames: { $each: names } },
            });
            await List.updateMany(
              { group: group.name },
              { $addToSet: { users: args.email } }
            );

            let logT = new Log({
              email: user.email,
              operation: `${req.email}, added ${args.email} to group ${group.name}`,
              time: Date.now(),
            });
            logT.save();

            return user;
          } else {
            return new Error("Unauthorized");
          }
        }
      },
    },
    addUserToBlockList: {
      type: userType,
      args: {
        token: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        let decodedToken;
        try {
          decodedToken = jwt.verify(args.token, process.env.EMAIL_TOKEN);
        } catch (err) {
          return new Error("No match");
        }

        const isInside = await BlockList.find({ email: decodedToken.email });
        if (isInside.length > 0) {
          return new Error("You are already in block list");
        } else {
          blocked = new BlockList({
            email: decodedToken.email,
          });
          await blocked.save();
        }

        return await blocked;
      },
    },

    //change the value of isDone like true or false
    //gonna be used in checkbox
    changeListItemDone: {
      type: listItemType,
      args: {
        itemId: { type: GraphQLString },
        value: { type: GraphQLBoolean },
      },
      resolve: async (parent, args, req) => {
        const adminCheck = await List.find({
          admins: req.email,
          listItems: args.itemId,
        });
        if (adminCheck.length !== 0) {
          return await listItem.findByIdAndUpdate(args.itemId, {
            isDone: args.value,
          });
        } else {
          throw new Error("Unauthorized");
        }
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
