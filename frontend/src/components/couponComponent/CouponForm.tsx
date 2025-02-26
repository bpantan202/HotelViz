"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Stack,
  Chip,
} from "@mui/material";
import { CouponItem, SummaryCoupon } from "../../../interface";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker,LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

const tiers = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    
  ];

export default function CouponForm({
  coupon,
  onCouponChange,
  onNumberCouponChange,
}: {
    coupon: SummaryCoupon;
  onCouponChange: Function;
  onNumberCouponChange: Function;
}) {

  const [date, setDate] = useState<Dayjs | null>(dayjs(coupon._id!=""?coupon.expiredDate:Date.now()));
  

  {
    const [selectedTiers, setSelectedTiers] = useState(coupon.tiers);

    useEffect(() => {
        setSelectedTiers(coupon.tiers);
      
    }, [coupon.tiers]);
    return (
      <div datatest-id="coupon-form" className="bg-slate-100 rounded-lg space-y-5 w-full px-10 py-5 flex flex-col">
        <div>Coupon Type</div>

        <TextField
          variant="outlined"
          data-testid="name"
          name="name"
          label=""
          defaultValue={coupon._id}
          onChange={(e) => {
            coupon.type = e.target.value;
            onCouponChange(coupon);
          }}
        ></TextField>

        <div>Discount (Baht)</div>
        <TextField
          variant="outlined"
          data-testid="discount"
          name="discount"
          label=""
          defaultValue={coupon._id!=""?coupon.discount:null}
          onChange={(e) => {
            coupon.discount = Number(e.target.value);
            onCouponChange(coupon);
          }}
        ></TextField>

        <div>Points</div>
        <TextField
          variant="outlined"
          data-testid="point"
          name="point"
          label=""
          defaultValue={coupon._id!=""?coupon.point:null}
          onChange={(e) => {
            coupon.point = Number(e.target.value);
            onCouponChange(coupon);
          }}
        ></TextField>

     <div>Coupon expired Date</div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{
            svg: { color: '#000' },
              input: { color: '#000' },
              backgroundColor: "#F1F5F9",
            
          }}
          slotProps={{ textField: { size: "medium" } }}
          className="bg-white"
          name="DatePicker"
          data-testid="expire-date"
          defaultValue={coupon._id!=""?dayjs(coupon.expiredDate):dayjs(Date.now())}
          value={date}
          onChange={(newValue) => {
            if (newValue) {
            coupon.expiredDate = newValue.toDate();
            setDate(newValue);
            onCouponChange(coupon);}
          }}
        ></DatePicker>
      </LocalizationProvider>
      
        {!coupon._id?
<div datatest-id="numcoupon-div">

        <div>Numbers of Coupon</div>
        <TextField
          variant="outlined"
          data-testid="CouponNum"
          name="CouponNum"
          label=""
          defaultValue={null}
          onChange={(e) => {
            const value = e.target.value;
            onNumberCouponChange(value);
          }}
        ></TextField>
</div>
        :""
        }


        <div datatest-id="Tiers-lable">Tiers</div>
        <FormControl datatest-id="FormControl">
          <InputLabel>Tiers</InputLabel>
          <Select
            multiple
            name="tier"
            value={selectedTiers}
            onChange={(e) => {
              const selected = e.target.value as string[];
              setSelectedTiers(selected);
              coupon.tiers = selected;
              onCouponChange(coupon);
            }}
            input={<OutlinedInput label="Multiple Select" />}
            renderValue={(selected) => (
              <Stack gap={1} direction="row" flexWrap="wrap">
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    onDelete={() => {
                      const updatedTiers = selectedTiers.filter(
                        (item) => item !== value
                      );
                      setSelectedTiers(updatedTiers);
                      coupon.tiers = updatedTiers;
                      onCouponChange(coupon);
                    }}
                    deleteIcon={
                      <CancelIcon
                        onMouseDown={(event) => event.stopPropagation()}
                      />
                    }
                    sx={{
                      backgroundColor: "lightgrey",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "#2196f3",
                        color: "white",
                      },
                    }}
                  />
                ))}
              </Stack>
            )}
          >
            {tiers.map((name) => (
              <MenuItem
                key={name}
                value={name}
                sx={{ justifyContent: "space-between" }}
              >
                {name}
                {coupon.tiers.includes(name) ? (
                  <CheckIcon color="info" />
                ) : null}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
}
