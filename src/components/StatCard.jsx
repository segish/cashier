import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import CircularProgress from '@mui/material/CircularProgress';

const StatCard = ({ cash, transfer, credit, lable, totalExpense, netSale, netIncome, refetching,netCash }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" height="100%" bgcolor={colors.primary[400]} p={1} px={8} border={1} borderRadius={1} display="flex" alignItems="center" justifyContent="center">
      <Box display="flex" justifyContent="center">
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {lable}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent:"center" , color: 'secondary.main', gap: 2 }}>
            {lable === "TODAY'S SALE" ? "In Cash:" : lable === "TODAY'S NET" ? "NET SALE:" : ""}
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: colors.grey[100] }}
            >
              {refetching && (lable === "TODAY'S SALE" || lable === "TODAY'S NET") ?<CircularProgress color="secondary" size={10} />:lable === "TODAY'S SALE" ? cash+" Birr" : lable === "TODAY'S NET" ? netSale+" Birr" : ""}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent:"center" , color: 'secondary.main', gap: 2 }}>
            {lable === "TODAY'S SALE" ? "In Transfer:" : lable === "TODAY'S NET" ? "NET INCOME:" : ""}
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: colors.grey[100] }}
            >
              {refetching && (lable === "TODAY'S SALE" || lable === "TODAY'S NET") ? <CircularProgress color="secondary" size={10}  /> : lable === "TODAY'S SALE" ? transfer +" Birr": lable === "TODAY'S NET" ? netIncome+" Birr" : ""}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent:"center" , color: 'secondary.main', gap: 2 }}>
            {lable === "TODAY'S SALE" ? "In Credit:" : lable === "TODAY'S EXPENSE" ? "net expense:" : lable === "TODAY'S NET" ? "NET cah:" : ""}
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: colors.grey[100] }}
            >
              {refetching && (lable === "TODAY'S SALE" || lable === "TODAY'S EXPENSE" || lable === "TODAY'S NET") ? <CircularProgress color="secondary" size={10} /> : lable === "TODAY'S SALE" ? credit + " Birr" : lable === "TODAY'S EXPENSE" ? totalExpense + " Birr" : lable === "TODAY'S NET" ? netCash + " Birr" :""}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StatCard;
