import React, { useState } from "react";
import { Box, Grid, Radio } from "@mui/material";
import Fab from "@mui/material/Fab";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {
    DateInput,
    MuiRadioGroup
} from './MuiFormControls';
import { formFields } from '../FormFieldsConfig/formConfig_DateFilter';
import { Button } from '@mui/material';
import { datefilterexpense,TransactionList } from "../../services/DBconfunc";
import { toast } from "react-toastify";

export default function FloatFilterBtn({ setFilterDateUpdate, setFilterCountUpdate }) {
    const [fabopen, setfabOpen] = useState(false);
    const [filterDateopen, setfilterDateopen] = useState(false);
    const handleFilterDate = () => {
        setfabOpen(prev => !prev);
        setfilterDateopen(true);
    }

    const handleclose = () => {
        setfilterDateopen(false);
        setFormData('');
    }
    const [formData, setFormData] = useState({});

    const inputComponents = {
        date: DateInput,
        radio: MuiRadioGroup
    };

    const fieldTypeByKey = formFields.reduce((acc, field) => {
        acc[field.key] = field.type;
        return acc;
    }, {});
    const handleChange = (key, value) => {
        if (fieldTypeByKey[key] === 'checkbox') {
            setFormData((prev) => {
                const existing = prev[key] || [];
                const updated = existing.includes(value)
                    ? existing.filter((v) => v !== value)
                    : [...existing, value];
                return { ...prev, [key]: updated };
            });
        } else {
            setFormData((prev) => ({ ...prev, [key]: value }));
        }
    };
    const handleAllData = async () => {
        var originalRows = await TransactionList();
        if (originalRows.length == 0) {
            toast.error('No Data Found for the selected date range!');
            return
        }
        setFilterDateUpdate(originalRows);
        var expcnt = originalRows;
        var CountfilteredData = expcnt.map(item => ({
            total_credit: item.total_credit,
            total_debit: item.total_debit,
            total_transamount: item.total_transamount
        }));
        var CntFltDt = CountfilteredData[0]
        setFilterCountUpdate([CntFltDt])
    }

    const handleSubmit = async () => {
        var filStartDate = new Date(formData.FilterStartDate);
        var filEndDate = new Date(formData.FilterEndDate);
        var filtranscode = formData.FilterTOT;
        if (!filStartDate || !filEndDate || !filtranscode) {
            toast.error('Please Fill All the Fields!');
            return
        }
        var originalRows = await datefilterexpense(filStartDate, filEndDate, filtranscode);

        if (originalRows.length == 0) {
            toast.error('No Data Found for the selected date range!');
            return
        }
        setFilterDateUpdate(originalRows);
        var CountfilteredData = originalRows.map(item => ({
            total_credit: item.total_credit,
            total_debit: item.total_debit,
            total_transamount: item.total_transamount
        }));
        var CntFltDt = CountfilteredData[0]
        setFilterCountUpdate([CntFltDt])
    }

    return (<>
        <Dialog open={filterDateopen} onClose={handleclose}>
            <DialogTitle>Filter</DialogTitle>
              <DialogContent dividers>
                    <Grid container spacing={2}>
                      {formFields.map((field) => {
                        const Component = inputComponents[field.type];
                        if (!Component) return null;
            
                        const gridSize = field.gridSize || 6;
            
                        return (
                          <Grid item xs={12} sm={gridSize} key={field.key}>
                            {field.type === 'checkbox' ? (
                              <Component
                                label={field.label}
                                selectedValues={formData[field.key] || []}
                                onChange={(value) => handleChange(field.key, value)}
                                options={field.options}
                              />
                            ) : field.type === 'radio' ? (
                              <Component
                                label={field.label}
                                name={field.key}
                                value={formData[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                options={field.options}
                              />
                            ) : (
                              <Component
                                label={field.label}
                                value={formData[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                name={field.key}
                                options={field.options}
                              />
                            )}
                          </Grid>
                        );
                      })}
                    </Grid>
                  </DialogContent>            
            <DialogActions>
                <Grid item xs={8}>
                    <Button
                        variant="contained"
                        color="error"
                        size="large"
                        onClick={handleAllData}
                    >All</Button>
                </Grid>
                <Grid item xs={8}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                    >Filter</Button>
                </Grid>
                <Button onClick={handleclose}>Close</Button>
            </DialogActions>

        </Dialog>
        <Fab
            onClick={handleFilterDate}
            aria-label="Filter"
            style={{
                position: 'fixed',
                bottom: '50px',
                right: '20px',
                color: "white",
                backgroundColor: "grey"
            }}
        ><div style={{ fontSize: 35 }} > <i className="bi bi-funnel" style={{ fontSize: 25, }}></i></div>
        </Fab>
    </>

    )
}