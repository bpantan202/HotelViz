"use client";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Select, MenuItem, TextField } from "@mui/material";
import { Dayjs } from "dayjs";
import { RoomType } from "../../interface";

export default function DateReserve({
  contactName,
  contactEmail,
  contactTel,
  bookingDate,
  bookingLocation,
  onNameChange,
  onDateChange,
  onTelChange,
  onEmailChange,
  onLocationChange,
  roomtype,
  onRoomTypeChange,
}: {
  contactName: string;
  contactEmail: string;
  contactTel: string;
  bookingDate: Dayjs | null;
  bookingLocation: string;
  onNameChange: Function;
  onDateChange: Function;
  onTelChange: Function;
  onEmailChange: Function;
  onLocationChange: Function;
  roomtype: RoomType[];
  onRoomTypeChange: Function;
}) {
  const [date, setDate] = useState<Dayjs | null>(bookingDate);
  const [location, setLocation] = useState<String>(bookingLocation);
  const [roomType, setRoomType] = useState<RoomType>(roomtype[0]);
  

  if (date != bookingDate) setDate(bookingDate);

  return (
    <form className="space-y-2 rounded-lg w-full py-5 flex flex-col">
      {/* <div>Hotel Select</div>
      <Select
        fullWidth 
        variant="outlined"
        name="hospitalSelect"
        id="hospitalSelect"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
          onLocationChange(e.target.value);
        }}
        className="w-[200px]"
      >
        <MenuItem value="65df5083dc8452a715f007cd">Continental Hotel</MenuItem>
        <MenuItem value="6601131cb8800f973efcbcbe">Rajavithi Hospital</MenuItem>
      </Select> */}

      <div>Booking Date</div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          slotProps={{ textField: { size: "medium" } }}
          className="bg-white"
          defaultValue={date}
          value={date}
          onChange={(value) => {
            setDate(value);
            onDateChange(value);
          }}
        ></DatePicker>
      </LocalizationProvider>

    
      <div>Roomtype</div>
      <Select
        labelId="roomtype"
        value={roomType}
        label=""
        onChange={(e) => {
          setRoomType(e.target.value as RoomType)
          onRoomTypeChange(e.target.value);
        }}
      >
        
        {roomtype.map((room) => (
          <MenuItem 
          key={room.key} 
          value={room}
          >
            {room.key}
          </MenuItem>
        ))}

      </Select>

      <div>Contact Name</div>
      <TextField
        fullWidth
        variant="outlined"
        name="contactName"

        defaultValue={contactName}
        onChange={(e) => {
          onNameChange(e.target.value);
        }}
      ></TextField>
      <div>Contact Email</div>
      <TextField
        fullWidth
        variant="outlined"
        name="contactEmail"

        defaultValue={contactEmail}
        onChange={(e) => {
          onEmailChange(e.target.value);
        }}
      ></TextField>
      <div>Contact Telephone</div>
      <TextField
        fullWidth
        variant="outlined"
        name="contactTel"

        defaultValue={contactTel}
        onChange={(e) => {
          onTelChange(e.target.value);
        }}
      ></TextField>
    </form>
  );
}
