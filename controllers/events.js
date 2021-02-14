const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {

    const events = await Event.find().populate('user', 'name');

    res.json({
        status: true,
        events
    });

}

const createEvent = async (req, res = response) => {

    const event = new Event(req.body);

    try {
        event.user = req.uid;
        const saveEvent = await event.save();

        res.status(201).json({
            status: true,
            event: saveEvent
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error interno, por favor pongase en contacto con su administrador.'
        });
    }
}

const updateEvent = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                status: false,
                msg: 'El Id de evento no fue encontrado'
            }); 
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                status: false,
                msg: 'El usuario no está autorizado para efectuar esta acción.'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const uptEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });
        res.json({
            status: true,
            event: uptEvent
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error interno, por favor pongase en contacto con su administrador.'
        });
    }
}

const deleteEvent = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                status: false,
                msg: 'El Id de evento no fue encontrado'
            }); 
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                status: false,
                msg: 'El usuario no está autorizado para efectuar esta acción.'
            });
        }

        const delEvent = await Event.findByIdAndDelete({ _id: eventId });

        res.json({
            status: true,
            msg: 'Evento eliminado correctamente.'
        });
   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error interno, por favor pongase en contacto con su administrador.'
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
}
