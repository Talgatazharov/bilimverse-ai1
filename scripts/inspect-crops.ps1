Add-Type -AssemblyName System.Drawing

function Inspect-Bmp($path) {
    $bmp = [System.Drawing.Bitmap]::FromFile($path)
    Write-Host "File: $path, Size: $($bmp.Width)x$($bmp.Height)"
    # Check 4 corners
    $cTL = $bmp.GetPixel(0, 0)
    $cTR = $bmp.GetPixel($bmp.Width - 1, 0)
    $cBL = $bmp.GetPixel(0, $bmp.Height - 1)
    $cBR = $bmp.GetPixel($bmp.Width - 1, $bmp.Height - 1)
    Write-Host "  Corners: TL=($($cTL.R),$($cTL.G),$($cTL.B)), TR=($($cTR.R),$($cTR.G),$($cTR.B)), BL=($($cBL.R),$($cBL.G),$($cBL.B)), BR=($($cBR.R),$($cBR.G),$($cBR.B))"
    $bmp.Dispose()
}

Inspect-Bmp "public\assets\test_qyran_idle.png"
Inspect-Bmp "public\assets\test_qyran_happy.png"
Inspect-Bmp "public\assets\test_region_math.png"
Inspect-Bmp "public\assets\test_region_digital.png"
Inspect-Bmp "public\assets\test_chest_closed.png"
