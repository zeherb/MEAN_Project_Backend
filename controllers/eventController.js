const Event = require('../models/eventSchema');
const desaffectEvent = require('../middlewares/desaffect-event')
const affectEvent = require('../middlewares/affect-event')
const Tag = require('../models/tagSchema')
const jwt = require("jsonwebtoken");
const createNotif = require("../middlewares/notification")
const deleteNotif = require("../middlewares/deleteNotification");
const deleteNotification = require('../middlewares/deleteNotification');

// add event
exports.addEvent = async (req, res) => {
    try {
        const tagNamesList = JSON.parse(req.body.tags)
        let tagIdList = [];
        for (let i = 0; i < tagNamesList.length; i++) {
            const element = tagNamesList[i];
            let tag = await Tag.find({ name: element })
            let tagId = tag[0]._id;
            tagIdList.push(tagId)
        }
        let myEventType
        if (req.body.eventType == '0') {
            myEventType = "Free"
        } else {
            myEventType = "Payable"
        }
        const eventData = {
            image: req.file.filename,
            title: req.body.title,
            description: req.body.description,
            price: parseInt(req.body.price) || undefined,
            startDateTime: req.body.startDateTime,
            endDateTime: req.body.endDateTime,
            location: req.body.location,
            owner: req.params.connectedUserId,
            availableTicketNumber: parseInt(req.body.availableTicketNumber),
            eventType: myEventType,
            tags: tagIdList
        }
        if (!("image" in eventData && "title" in eventData && "description" in eventData && "startDateTime" in eventData && "endDateTime" in eventData && "location" in eventData && "availableTicketNumber" in eventData && "eventType" in eventData)) {
            res.status(400).json({ message: "Empty Field !" })
        } else {
            const newEvent = await Event.create(eventData)
            // event affectation automatically
            affectEvent(res, req.params.connectedUserId, newEvent._id)
            res.status(200).json({ message: "event created successfully" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}

// update event
exports.updateEvent = async (req, res) => {
    try {
        const tagNamesList = req.body.tags
        let tagIdList = [];
        for (let i = 0; i < tagNamesList.length; i++) {
            const element = tagNamesList[i];
            let tag = await Tag.find({ name: element })
            let tagId = tag[0]._id;
            tagIdList.push(tagId)
        }
        let myEventType
        if (req.body.eventType == '0') {
            myEventType = "Free"
        } else {
            myEventType = "Payable"
        }
        const eventData = {
            title: req.body.title,
            description: req.body.description,
            price: parseInt(req.body.price) || undefined,
            startDateTime: req.body.startDateTime,
            endDateTime: req.body.endDateTime,
            location: req.body.location,
            owner: req.params.connectedUserId,
            availableTicketNumber: parseInt(req.body.availableTicketNumber),
            eventType: myEventType,
            tags: tagIdList
        }
        if (!("title" in eventData && "description" in eventData && "startDateTime" in eventData && "endDateTime" in eventData && "location" in eventData && "availableTicketNumber" in eventData && "eventType" in eventData)) {
            res.status(400).json({ message: "Empty Field !" })
        } else {

            const updatedEvent = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
            res.status(200).json({ message: "event updated successfully", updatedEvent });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// delete event
exports.deleteEvent = async (req, res) => {
    try {
        const eventToDelete = await Event.findById(req.params.eventId).populate({ path: 'owner' });
        const token = req.headers.authorization.split(" ").pop();
        const decodedToken = await jwt.decode(token);
        if (decodedToken.role === "admin" && eventToDelete.owner._id !== decodedToken.userId) {
            createNotif("delete", decodedToken.userId, eventToDelete._id, 'your event has been deleted by and admin : \n' + eventToDelete.title, eventToDelete.owner._id)
            const io = req.app.get('io')
            const usersArray = req.app.get('usersArray')
            const notify = { text: "An Admin has deleted one of your events" }
            io.to(usersArray[eventToDelete.owner._id]).emit('notification', notify);
        }
        const deletedNotification = deleteNotification(req.params.eventId)
        const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);
        desaffectEvent(res, req.params.connectedUserId, req.params.eventId)
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// update event image
exports.updateEventImage = async (req, res) => {
    try {
        const eventData = {
            image: req.file.filename
        }
        if (!("image" in eventData)) {
            res.status(400).json({ message: "Empty Field !" })
        } else {
            const updatedEvent = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
            res.status(200).json({ message: "event pictutre updated successfully", updatedEvent });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}

// affect owner manually
exports.affectOwner = async (req, res) => {
    try {
        const affectedOwnertoEvent = await Event.findByIdAndUpdate(req.params.idEevent, { owner: req.params.idOwner }, { new: true });
        res.status(200).json({ message: "Owner affected successfully", affectedOwnertoEvent });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// desaffect owner
exports.desaffectOwner = async (req, res) => {
    try {
        const desaffectedOwnertoEvent = await Event.findByIdAndUpdate(req.params.idEvent, { owner: null }, { new: true });
        res.status(200).json({ message: "Owner desaffected successfully", desaffectedOwnertoEvent });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// affect tag
exports.affectTag = async (req, res) => {
    try {
        const affectedTagToEvent = await Event.findByIdAndUpdate(req.params.idEvent, { $push: { tags: req.params.idTag } }, { new: true });
        res.status(200).json({ message: "Tag affected successfully", affectedTagToEvent })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// desaffect tag
exports.desaffectTag = async (req, res) => {
    try {
        const desaffectedTagToEvent = await Event.findByIdAndUpdate(req.params.idEvent, { $pull: { tags: req.params.idTag } }, { new: true });
        res.status(200).json({ message: "Tag affected successfully", desaffectedTagToEvent })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// get all full events
exports.getAllFullEvents = async (req, res) => {
    try {
        const fullEvents = await Event.find({}).populate({ path: 'owner tags', select: 'firstName lastName email address avatar name description' });
        res.status(200).json(fullEvents);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// get event by id 
exports.getEvent = async (req, res) => {
    try {
        const fullEvent = await Event.findById(req.params.id).populate({ path: 'owner tags', select: 'firstName lastName email address avatar name description -_id' });
        res.status(200).json(fullEvent);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}