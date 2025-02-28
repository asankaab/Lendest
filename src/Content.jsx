import { useLoaderData, Form, useActionData, useNavigation, useFetcher} from 'react-router-dom'
import { AuthContext } from './Context';
import { useContext, useEffect, useState} from 'react';
import { Box, Button, ButtonGroup, Card, Divider, IconButton, InputAdornment, Popover, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { AddCircleOutlineRounded, Close, DeleteRounded, DriveFileRenameOutline, Save } from '@mui/icons-material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid, gridClasses, GridToolbarContainer } from '@mui/x-data-grid';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function Content() {

    const state = useContext(AuthContext);

    const error = useActionData();

    // ****** Time ***********

    const [timeNow, setTimeNow] = useState(dayjs());

    setInterval(() => {
            setTimeNow(dayjs())
        }, 60000);

    // ***** 

    const {name, docId, details, total} = useLoaderData();

    // *****

    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        if (navigation.state === 'loading') {
            setLoading(true);
        } else {
            setLoading(false);
        }
    },[navigation.state])

    // *****

    const columns = [
        {
          field: 'date',
          headerName: 'Date',
          type: 'string',
          minWidth: 120,
          flex: 3,
          editable: false,
          valueGetter: (value)=> {
            return dayjs(value.seconds * 1000).format('YYYY-MMM-DD hh:mm A');
          }
        },
        {
          field: 'amount',
          headerName: 'Amount',
          type: 'number',
          minWidth: 120,
          flex: 1,
          editable: false,
        }
      ]
      
    const rows = details;

    const[editMode, setEditMode] = useState(false);

    function editModeHandler() {
        if(!editMode) {
            setEditMode(true)
        } else {
        setEditMode(false)
        }
    }

    const [removeList, setremoveList] = useState([]);

    function CustomToolbar() {
        if(state && editMode)
        return (
          <GridToolbarContainer>
            <Form method='post'>
                <Button onClick={removeHandler} variant='contained' size='small' startIcon={<Save />} disableElevation>Remove</Button>
            </Form>
          </GridToolbarContainer>
        )
      }

    const fetcher = useFetcher();

    async function removeHandler() {
        if (removeList[0]) {
            let formData = new FormData();
            formData.append('action', 'deleteItems')
            formData.append('removeList',removeList)
            fetcher.submit(formData, {method: 'post'})
            setEditMode(false)
        }
    }

    // ********

    const [anchorEl, setAnchorEl] = useState(null);

    const closeDelete = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
      }

    // ********

    async function addHandler(e) {
        if (!removeList[0]) {
            let formData = new FormData();
            formData.append('action', 'add')
            formData.append('amount', e.target[0].value)
            formData.append('date', e.target[1].value)
            fetcher.submit(formData, {method: 'post'})
        }
    }
    
    return (
        <Stack spacing={2} sx={{width: '100%'}}>
            <Stack direction='row' gap={2}>                
                <Stack direction='row' alignItems='center' justifyContent='space-between' flexWrap='wrap' sx={{width: '100%'}}>
                    <Stack direction='row' gap={1}>
                        <Typography variant='h4'>{navigation.state === 'loading' ? <Skeleton width={80} /> : total}</Typography>
                        <Typography variant='caption'>{navigation.state === 'loading' ? null : ' LKR'}</Typography>
                        <Divider orientation='vertical' flexItem/>
                        <Typography variant='h4' color='primary'>{navigation.state === 'loading' ? <Skeleton width={80} /> : name}</Typography>
                    </Stack>
                    <Stack direction='row' gap={1}>
                    <ButtonGroup aria-label="edit or delete" size='small'>
                        {editMode? 
                            <IconButton disabled={!state || loading} onClick={editModeHandler}><Close/></IconButton> : 
                            <IconButton disabled={!state || loading} onClick={editModeHandler}><DriveFileRenameOutline/></IconButton> }
                            <Divider orientation='vertical' variant='middle' flexItem />
                        <IconButton onClick={closeDelete} color='primary' disabled={!state || loading}><DeleteRounded /></IconButton>
                    </ButtonGroup>
                    </Stack>
                </Stack>
                    <Popover 
                        elevation={4}
                        anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }} 
                        onClose={handleClose} open={open} anchorEl={anchorEl}>
                        <Card sx={{p: 2, maxWidth: 250}}>
                            <Typography variant='body'>Permanently delete <b>{name}</b> and all data?</Typography>
                                <Stack spacing={1} direction='row'>
                                    <Form method='post'>
                                        <Button variant='outlined' type='submit' name='deleteuser' value="confirmed">Yes</Button>
                                    </Form>
                                    <Button variant='contained' disableElevation onClick={closeDelete}>No</Button>
                                </Stack>
                        </Card>
                    </Popover> 
            </Stack>

            <Box sx={{
                        height: 409,
                        overflow: 'auto',
                        width: '100%',
                        [`.${gridClasses.cell}.negative`]: {
                        color: '#ce2200',
                        },
                    }}>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    editMode='row'
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 5,
                        },
                    },
                    }}
                    pageSizeOptions={[5]}
                    autoPageSize
                    autosizeOnMount
                    onRowSelectionModelChange={(params)=> setremoveList(params)}
                    checkboxSelection={editMode}
                    disableRowSelectionOnClick
                    loading={fetcher.state === 'loading' ? true : false}
                    getCellClassName={(params) => {
                        if (params.field === 'amount' && params.value < 0) {
                            return params.value < 0 ? 'negative' : null;
                        }
                        return '';
                        }}
                    disableColumnMenu={true}
                    slots={{ toolbar: CustomToolbar }}
                />
            </Box>

            <fetcher.Form method='post' onSubmit={(e) => addHandler(e)}>
                <Stack direction='row' flexWrap='wrap' gap={2}>
                    <TextField autoComplete='off' InputProps={{endAdornment: <InputAdornment position="start">LKR</InputAdornment>}} 
                    label="Amount" variant="standard" type='tel' name='amount' disabled={!state || loading}/>
                    <Stack direction='row' gap={2} flexWrap='wrap' alignContent='flex-start'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker label="Date" name="date" value={timeNow} disabled={!state || loading}/>
                        </LocalizationProvider>
                        <Button variant='outlined' type='submit' startIcon={<AddCircleOutlineRounded />} disabled={!state || loading}>Add</Button>
                    </Stack>
                </Stack>
            </fetcher.Form>
        </Stack>
    )
}

export default Content;