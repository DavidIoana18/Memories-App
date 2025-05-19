import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button, DialogActions } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

function DeleteAccountDialog({open, onClose, handleDeleteUser, setDeleteConfirmOpen}) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                Confirm Account Deletion
            </DialogTitle>
            
            <DialogContent>
                <Typography>
                    This will permanently delete your account and all your data. 
                    Are you absolutely sure?
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    sx={{
                        color: '#495057',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                    }}
                    onClick={() => setDeleteConfirmOpen(false)}
                >
                     Cancel
                </Button>

                <Button
                    sx={{
                        color: '#F2F1EB',
                        backgroundColor: '#d9534f',
                        '&:hover': { backgroundColor: '#c12e2a' },
                        ml: 2
                    }}
                    onClick={handleDeleteUser}
                >
                     Delete Permanently
                </Button>
                
            </DialogActions>
        </Dialog>
    );
}

export default DeleteAccountDialog;