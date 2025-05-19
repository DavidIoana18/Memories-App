
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Avatar, Typography, Box
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';

function EditProfileDialog({
  open,
  onClose,
  newBio,
  setNewBio,
  newImage,
  setNewImage,
  uploading,
  handleCloudinaryUpload,
  handleSave,
  fileInputKey,
  setFileInputKey,
  setDeleteConfirmOpen
}){

    return( 
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>
                Edit your profile
            </DialogTitle>
    
            <DialogContent sx={{ pb: 0 }}>
                <Box sx={{ position: 'relative' }}>
                    <TextField
                        label="Write something about yourself"
                        fullWidth
                        multiline
                        rows={3}
                        value={newBio}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 200) {
                                setNewBio(value);
                            }
                        }}
                        sx={{ 
                            mb: 1, 
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'gray' },
                                '&:hover fieldset': { borderColor: 'gray' },
                                '&.Mui-focused fieldset': { borderColor: 'gray' },
                            },
                            '& .MuiInputLabel-root': { color: 'gray' },
                            '& .MuiInputLabel-root.Mui-focused': { color: 'gray' },
                        }}
                    />

                    <Typography
                        variant="caption"
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 16,
                            color: newBio.length >= 200 ? 'error.main' : 'text.secondary',
                        }}
                    >
                        {`${newBio.length} / 200 characters`}
                    </Typography>
                </Box>
    
                <Button 
                    component="label"
                    sx={{
                        color: '#F2F1EB',
                        backgroundColor: '#88AB8E',
                        '&:hover': { backgroundColor: '#AFC8AD' },
                        textTransform: 'none',
                        mt: 2
                    }}
                >
                    <CameraAltIcon sx={{ mr: 1 }} /> Upload profile image
                    <input
                        key={fileInputKey}
                        type="file"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleCloudinaryUpload(file);
                        }}
                    />
                </Button>
    
                {uploading && (
                    <Typography sx={{ mt: 2, fontStyle: 'italic', fontWeight: 'bold' }} variant="body2">
                        Uploading...
                    </Typography>
                )}
    
                {newImage && (
                    <Box mt={2}>
                        <Typography sx={{ mt: 2, mb: 2, fontStyle: 'italic', fontWeight: 'bold' }}>
                            Preview:
                        </Typography>
                        
                        <Avatar src={newImage} sx={{ width: 65, height: 65 }} />
                        
                        <Button
                            sx={{
                                color: '#F2F1EB',
                                backgroundColor: '#88AB8E',
                                '&:hover': { backgroundColor: '#AFC8AD' },
                                textTransform: 'none',
                                mt: 2
                            }}
                            onClick={() => {
                                setNewImage('');
                                setFileInputKey(Date.now());
                            }}
                        >
                            <NoPhotographyIcon sx={{ mr: 1 }} /> Remove current image
                        </Button>
                    </Box>
                )}
            </DialogContent>
    
            <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
                <Button
                    sx={{
                        color: '#F2F1EB',
                        backgroundColor: '#d9534f',
                        '&:hover': { backgroundColor: '#c12e2a' },
                        textTransform: 'none'
                    }}
                    onClick={() => setDeleteConfirmOpen(true)}
                >
                     Delete Account
                </Button>
    
                <Box>
                    <Button 
                        sx={{
                            color: '#F2F1EB',
                            backgroundColor: '#88AB8E',
                            '&:hover': { backgroundColor: '#AFC8AD' },
                            textTransform: 'none',
                            mr: 1
                        }}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button 
                        sx={{
                            color: '#F2F1EB',
                            backgroundColor: '#88AB8E',
                            '&:hover': { backgroundColor: '#AFC8AD' },
                            textTransform: 'none'
                        }}
                        onClick={handleSave}
                        disabled={uploading}
                    >
                        Save
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default EditProfileDialog;