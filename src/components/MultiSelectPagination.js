import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useConstants } from '../hooks/UseConstants';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

function getStyles(name, itemName, theme) {
    return {
        fontWeight: itemName.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

export default function MultipleSelectChipPagination({ names = null, data = null, onChange, title, selected, setPage, isLoading, perPage, total, page }) {
    const theme = useTheme();
    const { language } = useConstants();
    const [itemName, setItemName] = React.useState([]);
    const menuRef = React.useRef(null);

    const handleScroll = (event) => {
        const target = event.target;

        const nearBottom =
            target.scrollTop + target.clientHeight >= target.scrollHeight - 10;

        if (nearBottom && !isLoading && page * perPage < total) {
            setPage((prev) => prev + 1);
        }
    };


    const handleChange = (event, id) => {
        const {
            target: { value },
        } = event;
        setItemName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div>
            <FormControl className='w-full'>
                <InputLabel id="demo-multiple-chip-label">{title}</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={selected ? selected : itemName}
                    onChange={(e) => { handleChange(e); onChange(e.target.value) }}
                    onScroll={handleScroll}
                    inputProps={{ rel: menuRef }}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((id) => {
                                const item = data.find((d) => d.id === id);
                                return <Chip key={id} label={language === 'en' ? item.name_en : item.name_ar} />;
                            })}
                        </Box>
                    )}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                width: 250,
                            },
                            onScroll: handleScroll,
                        },
                    }}
                >
                    {
                        names &&
                        names.map((name) => (
                            <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(name, itemName, theme)}
                            >
                                {name}
                            </MenuItem>
                        ))}
                    {data &&
                        data.map((item) => (
                            <MenuItem
                                key={item.id}
                                value={item.id}
                                style={getStyles(item.id, itemName, theme)}
                            >
                                {localStorage.getItem('language') == 'en' ? item.name_en : item.name_ar}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </div>
    );
}
