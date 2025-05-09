import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig.js'; // import the axios instance
import {Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {Grid, Fab} from '@mui/material';
import MemoryCard from './MemoryCard.js';
import FormInputMUI from './FormInputMUI.js'
import Button from './Button/Buton.js';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';

function Memories() {
    const {userId} = useParams(); // get the userId from the URL
    const [memories, setMemories] = useState([]); // store the list of memories
    const [loading, setLoading] = useState(true); // indicate if the data is loading from the server
    const [error, setError] = useState(null); // store any error messages
    const [editingMemory, setEditingMemory] = useState(null); // store the memory that is being edited by the user
    const [showForm, setShowForm] = useState(false); // show or hide the form for adding/editting a new memory
    const [inputFormError, setinputFormError] = useState({});

    const [newMemory, setNewMemory] = useState({
        title: '',
        description: '',
        hashtag: '',
        imageUrl: ''
    }); // store the new memory data
  
    useEffect(() => { // Fetch memories when the component mounts
        fetchMemories();
    }, [userId]); // Fetch memories when the userId changes

    async function fetchMemories() {
        setLoading(true);
        setError(null);

        try {
            let response;
            if(userId){
                response = await api.get(`/memories/user/${userId}`); // Fetch other user memories
            }else{
                response = await api.get('/memories'); // Fetch own memories
            }
            setMemories(response.data.memories);  // Set the memories state with the response data
        } catch (err) {
            setError('Failed to load memories: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddMemory() {
        if (!handleValidation(newMemory))  return;
        
        try {
            console.log('New memory before sending to API:', newMemory);
            const response = await api.post('/memories', newMemory);
            console.log('Server Response: ', response);
            setMemories([...memories, response.data.memory]); // Add new memory to the list
            //setNewMemory({ title: '', description: '', hashtag: '', image_url: '' }); // Clear form
            setShowForm(false);
        } catch (err) {
            setError('Failed to add memory: ' + err.message);
        }
    }

    async function handleEditMemory() {
        if (!handleValidation(editingMemory)) return;

        try {
            const response = await api.put(`/memories/${editingMemory.id}`, editingMemory);
            setMemories(memories.map((memory) => (memory.id === editingMemory.id ? response.data.memory : memory)));
            setEditingMemory(null); // Reset editing
            setShowForm(false);
        } catch (err) {
            setError('Failed to update memory: ' + err.message);
        }
    }

    async function handleDeleteMemory(id) {
        try {
            await api.delete(`/memories/${id}`);
            setMemories(memories.filter((memory) => memory.id !== id)); // Remove deleted memory from list
        } catch (err) {
            setError('Failed to delete memory: ' + err.message);
        }
    }

    // if the user modifies a memory or create a new one
    function updateMemoryState(name, value) {
        if (editingMemory) {
            setEditingMemory({ ...editingMemory, [name]: value });
        } else {
            setNewMemory({ ...newMemory, [name]: value });
        }
    }

    function handleInputChange(event) { // Handle input changes in the form
        const { name, value } = event.target;
        
        if (name === 'hashtag') {
           const newHashtags = value.trim().split(' ');

           // if the last hashtag is just '#'(is incomplete), remove it
            if(newHashtags[newHashtags.length - 1] === '#'){
                newHashtags.pop();
                const newHashtag = newHashtags.join(' ');
                updateMemoryState(name, newHashtag);
                return;
            }

            // if the user types a space or the input is empty, don't add # to the last word
            if (value.endsWith(' ') || value === '') {
                updateMemoryState(name, value);
                return;
            }
    
            // break the hashtags values into words and get the last word
            const lastWord = newHashtags[newHashtags.length - 1];
            
            // if the last word doesn't start with '#' (user didn't add it), add it
            if (lastWord && !lastWord.startsWith('#')) {
                newHashtags[newHashtags.length - 1] = `#${lastWord}`;
                const newValue = newHashtags.join(' ');
                updateMemoryState(name, newValue);
            } else {
                // if the user types '#' in front of a word just add it to the value
                updateMemoryState(name, value);
            }

        } else {
            // for the other inputs (title, descrition, image_url), just set the value
            updateMemoryState(name, value);
        }
    }

    function startEditing(memory) { // if the user clicks on the edit button, set the editingMemory state to the memory that is being edited
        setEditingMemory({ ...memory });
        setShowForm(true); // Show the form for editing
        setinputFormError({});
    }

    function cancelEditing() { // if the user clicks on the cancel button, reset the editingMemory state
        setEditingMemory(null);
        setShowForm(false);
    }

    function handleEditAddButton(){
        // Handle the click event for the more vert icon
        setEditingMemory(null); // Reset the editingMemory state
        setNewMemory({ title: '', description: '', hashtag: '', imageUrl: '' }); // Clear the new memory state
        setShowForm(!showForm)
    }

    function handleValidation(memoryData) { // Validate the input fields
        const formErrors = {};
        if (!memoryData.title) formErrors.title = 'Title is required!';
        if (!memoryData.description) formErrors.description = 'Description is required!';
        // if (!memoryData.image_url) formErrors.image_url = 'Image URL is required!';
    
        setinputFormError(formErrors);
        return Object.keys(formErrors).length === 0; // if there are no errors return true
    }

    async function handleCloudinaryUpload(file) {
            
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'unsigned_memories'); 
    
        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dki5xequi/image/upload', {
                method: 'POST',
                body: formData
            });
    
            const data = await res.json();
            const imageUrl = data.secure_url;
    
            if (editingMemory) {
                setEditingMemory(prev => ({ ...prev, imageUrl: imageUrl }));
            } else {
                setNewMemory(prev => ({ ...prev, imageUrl: imageUrl }));
            }
            console.log('Image uploaded to Cloudinary:', imageUrl);
        } catch (err) {
            console.error('Eroare upload Cloudinary:', err);
            setError('Upload failed. Please try again.');
        }
    }
    
    if (loading) return <p style={{ marginLeft: '30px' }}>Loading memories...</p>;
    //  if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '5px' }}>

            {/* <h2>Memories</h2> */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleEditAddButton}
                sx={{ 
                    position: 'fixed', 
                    bottom: 80, right: 16,
                    backgroundColor: '#88AB8E', 
                    '&:hover': {
                        backgroundColor: '#AFC8AD', 
                    },
                    color: '#fff',
                 }}
            >
                <AddIcon />
            </Fab>

            <Dialog open={showForm} onClose={cancelEditing} fullWidth maxWidth="sm">
                <DialogTitle>{editingMemory ? 'Edit Memory' : 'Add Memory'}</DialogTitle>
                <DialogContent dividers>
                    <FormInputMUI
                        type="text"
                        name="title"
                        value={editingMemory ? editingMemory.title : newMemory.title || ""}
                        onChange={handleInputChange}
                        placeholder="Title"
                        required={true}
                        error={!!inputFormError.title}
                        helperText={inputFormError.title}
                    />

                    <FormInputMUI
                        type="text"
                        name="description"
                        value={editingMemory ? editingMemory.description : newMemory.description || ""}
                        onChange={handleInputChange}
                        placeholder="Description"
                        required={true}
                        multiline={true}
                        rows={4}
                        error={!!inputFormError.description} 
                        helperText={inputFormError.description}
                    />

                    <FormInputMUI
                        type="text"
                        name="hashtag"
                        value={editingMemory ? editingMemory.hashtag : newMemory.hashtag || ""}
                        onChange={handleInputChange}
                        placeholder="Hashtag"
                        required={true}
                        
                    />

                    {!editingMemory && ( 
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>{
                                const file = e.target.files[0];
                                if(file){
                                    handleCloudinaryUpload(file);
                                }
                            }}
                            style={{ marginTop: 16 }}
                        />   
                    )}
                   

                    {(editingMemory?.imageUrl || newMemory.imageUrl) && (
                        <img
                            src={editingMemory?.imageUrl || newMemory.imageUrl}
                            alt="Preview"
                            style={{ width: '50%', marginTop: 10, borderRadius: 4 }}
                        />
                    )}
                </DialogContent>

                <DialogActions>
                    {editingMemory ? (
                            <Button onClick={handleEditMemory}>Save Changes</Button>
                        ) : (
                            <Button onClick={handleAddMemory}>Add</Button>
                        )}

                        <Button onClick={cancelEditing}>Cancel</Button>
                </DialogActions>
            </Dialog>
            

            {/*Display memories using MmeoryCard component*/}
            {memories.length === 0 ? (
                <p>No memories found. Try creating one!</p>
            ) : (
                <Grid 
                    container 
                    spacing={2}
                    sx={{
                        padding: 1,
                        marginBottom: 4, 
                        marginTop: 1,
                        marginRight: 4,
                        justifyContent: 'flex-start', // Center the grid items
                    }}
                >
                    {memories.map((memory) => (
                        <Grid  key={memory.id} size={{xs: 12, sm: 6, md: 3}}>
                            <MemoryCard
                                memory={memory}
                                onEdit={startEditing}
                                onDelete={handleDeleteMemory}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
}

export default Memories;
