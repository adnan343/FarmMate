# Farm Selection Features for Farm Condition Reports

## Overview
This document describes the farm selection functionality implemented for the farm condition reports section in FarmMate.

## Features Implemented

### 1. Dynamic Farm Loading
- **API Integration**: Added farm API functions in `frontend/lib/api.js` to fetch farms from the backend
- **Real-time Data**: Farm selection now shows actual farms from the database instead of hardcoded placeholder data
- **User-specific Farms**: Only shows farms that belong to the currently logged-in farmer

### 2. Farm Selection UI
- **Empty State**: When no farms are available, shows a helpful message with an "Add New Farm" button
- **Farm Dropdown**: Displays all available farms in a dropdown menu when farms exist
- **Add Farm Link**: Provides a link to add additional farms even when farms are already available

### 3. Seamless Navigation
- **Form Persistence**: When navigating to add a new farm, the current form data is preserved
- **Auto-refresh**: Farm list automatically refreshes when returning from the farm profile page
- **Session Storage**: Uses session storage to maintain form state during navigation

## Technical Implementation

### API Functions Added (`frontend/lib/api.js`)
```javascript
// Get farms by farmer ID
export async function getFarmsByFarmer(farmerId)

// Get all farms (admin function)
export async function getAllFarms()

// Create new farm
export async function createFarm(farmData)

// Update existing farm
export async function updateFarm(farmId, farmData)

// Delete farm
export async function deleteFarm(farmId)
```

### Component Updates

#### FarmConditionForm.js
- **Dynamic Farm Loading**: Fetches farms from API using current user ID
- **Empty State Handling**: Shows appropriate UI when no farms are available
- **Form Persistence**: Preserves form data when navigating to add farms
- **Auto-refresh**: Refreshes farm list when window gains focus

#### Farm Condition Reports Page
- **Clean Display**: Removed hardcoded farm name fallbacks
- **Real Farm Names**: Shows actual farm names from the database

## User Experience

### When No Farms Exist
1. User sees a clear message: "No Farms Available"
2. Explanation: "You need to add a farm before creating condition reports"
3. Call-to-action: "Add New Farm" button that navigates to farm profile page

### When Farms Exist
1. User sees a dropdown with all their farms
2. Can select any farm from the list
3. Option to add more farms via "+ Add another farm" link

### Navigation Flow
1. User fills out farm condition form
2. Clicks "Add New Farm" if needed
3. Navigates to farm profile page
4. Adds new farm
5. Returns to farm condition form
6. Form data is preserved and farm list is refreshed
7. New farm appears in dropdown

## Backend Integration

### Existing Endpoints Used
- `GET /api/farms/farmer/:farmerId` - Get farms by farmer
- `POST /api/farms` - Create new farm
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm

### Authentication
- All farm API calls include authentication headers
- Uses cookies for user session management
- Only shows farms belonging to the authenticated user

## Error Handling
- **API Failures**: Gracefully handles API errors and shows empty state
- **Network Issues**: Provides fallback behavior when network is unavailable
- **Invalid Data**: Validates farm data before submission

## Future Enhancements
- **Farm Search**: Add search functionality for farmers with many farms
- **Farm Categories**: Group farms by type or location
- **Recent Farms**: Show recently used farms at the top
- **Farm Validation**: Ensure farm data is complete before allowing condition reports

## Testing
To test the functionality:
1. Login as a farmer
2. Navigate to Farm Condition Reports
3. Click "New Report"
4. Verify farm selection shows actual farms or empty state
5. Test adding new farms and returning to form
6. Verify form data persistence and farm list refresh
