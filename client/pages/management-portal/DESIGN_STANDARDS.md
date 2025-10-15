# Management Portal Design Standards

## Consistent UI Patterns for All Management Pages

### 1. **Imports**
Always import design system from the centralized location:
```tsx
import { COLORS, COMPONENTS, ROLE_COLORS } from '@/lib/management-design-system';
```

### 2. **Loading State**
Standard loading animation with icon:
```tsx
if (loading) {
  return (
    <div className="min-h-96 flex items-center justify-center" style={{ backgroundColor: COLORS.neutral[50] }}>
      <div className="text-center">
        <div className="relative mb-6">
          <div 
            className="w-16 h-16 border-4 rounded-full animate-spin"
            style={{ 
              borderColor: COLORS.neutral[200],
              borderTopColor: COLORS.primary[600]
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Relevant icon here */}
            <Icon className="h-6 w-6 animate-pulse" style={{ color: COLORS.primary[600] }} />
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.neutral[900] }}>Loading...</h3>
        <p style={{ color: COLORS.neutral[600] }}>Fetching data...</p>
      </div>
    </div>
  );
}
```

### 3. **Page Header**
Consistent header structure:
```tsx
<div className="flex items-center justify-between mb-8">
  <div>
    <h1 className="text-3xl font-bold" style={{ color: COLORS.neutral[900] }}>Page Title</h1>
    <p className="mt-2" style={{ color: COLORS.neutral[600] }}>Brief description of the page</p>
  </div>
  {user?.role === 'admin' && (
    <Button 
      onClick={openCreateDialog}
      className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
      style={{ 
        backgroundColor: COLORS.primary[600], 
        color: 'white',
        border: 'none'
      }}
    >
      <Plus className="h-4 w-4 mr-2" />
      Create New
    </Button>
  )}
</div>
```

### 4. **Error Alert**
Standard error display with retry:
```tsx
{error && (
  <div 
    className="rounded-lg p-6 border mb-6"
    style={{ 
      backgroundColor: COLORS.error[50], 
      borderColor: COLORS.error[200] 
    }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-3" style={{ color: COLORS.error[600] }} />
        <div>
          <h3 className="font-semibold mb-1" style={{ color: COLORS.error[800] }}>Error Loading Data</h3>
          <p style={{ color: COLORS.error[600] }}>{error}</p>
        </div>
      </div>
      <Button
        onClick={fetchData}
        variant="outline"
        className="transition-colors duration-200"
        style={{ 
          color: COLORS.error[600], 
          borderColor: COLORS.error[200] 
        }}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    </div>
  </div>
)}
```

### 5. **Stats Cards**
Standard stats card layout (4 columns):
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card 
    className="shadow-sm border-0 transition-shadow duration-200 hover:shadow-md"
    style={{ backgroundColor: 'white' }}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm" style={{ color: COLORS.primary[600] }}>Metric Title</p>
          <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>123</p>
        </div>
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: COLORS.primary[100] }}
        >
          <Icon className="h-6 w-6" style={{ color: COLORS.primary[600] }} />
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

### 6. **Search & Filter Bar**
Standard search and filter section:
```tsx
<Card 
  className="shadow-sm border-0"
  style={{ backgroundColor: 'white' }}
>
  <CardContent className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: COLORS.neutral[400] }} />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 border transition-colors duration-200"
            style={{ borderColor: COLORS.neutral[200] }}
          />
        </div>
      </div>
      {/* Add filters and view toggles here */}
    </div>
  </CardContent>
</Card>
```

### 7. **Empty State**
Standard empty state display:
```tsx
{filteredData.length === 0 ? (
  <Card 
    className="shadow-sm border-0"
    style={{ backgroundColor: 'white' }}
  >
    <CardContent className="p-12 text-center">
      <Icon className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.neutral[300] }} />
      <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.neutral[900] }}>No Data Found</h3>
      <p className="mb-6" style={{ color: COLORS.neutral[600] }}>
        {searchTerm || statusFilter !== 'all'
          ? 'Try adjusting your filters'
          : 'Get started by creating your first item'
        }
      </p>
      {!searchTerm && statusFilter === 'all' && user?.role === 'admin' && (
        <Button 
          onClick={openCreateDialog} 
          className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
          style={{ 
            backgroundColor: COLORS.primary[600], 
            color: 'white',
            border: 'none'
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create First Item
        </Button>
      )}
    </CardContent>
  </Card>
) : (
  {/* Render data here */}
)}
```

### 8. **Color Usage Guidelines**

- **Primary Actions**: `COLORS.primary[600]` (blue)
- **Destructive Actions**: `COLORS.error[600]` (red)
- **Success States**: `COLORS.success[600]` (green)
- **Warning States**: `COLORS.warning[600]` (orange)
- **Background**: `COLORS.neutral[50]` (light gray)
- **Text Primary**: `COLORS.neutral[900]` (dark gray)
- **Text Secondary**: `COLORS.neutral[600]` (medium gray)
- **Borders**: `COLORS.neutral[200]` (light gray)

### 9. **Spacing Standards**

- **Page Padding**: `p-6` or `className="space-y-6"`
- **Section Margins**: `mb-6` or `mb-8` for major sections
- **Card Padding**: `p-6`
- **Button Padding**: `px-6 py-3` for primary, `px-4 py-2` for secondary

### 10. **Transitions**

All interactive elements should have smooth transitions:
```tsx
className="transition-all duration-200 hover:shadow-lg"
```

---

## Implementation Checklist

For each management page, ensure:
- [ ] Uses `@/lib/management-design-system` for all design tokens
- [ ] Has consistent loading state with icon
- [ ] Has consistent error display with retry button
- [ ] Has page header with title and description
- [ ] Has stats cards (if applicable) in 4-column grid
- [ ] Has search/filter bar in white card
- [ ] Has proper empty state
- [ ] All colors use COLORS tokens
- [ ] All transitions are consistent
- [ ] Role-based access control for admin features
