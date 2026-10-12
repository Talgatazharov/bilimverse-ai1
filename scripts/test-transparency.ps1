Add-Type -AssemblyName System.Drawing

function Remove-Dark-Background($srcBmp, $darkThreshold = 45, $colorTolerance = 35) {
    $w = $srcBmp.Width
    $h = $srcBmp.Height
    $outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    # 2D visited array for edge-connected flood fill
    $visited = New-Object 'bool[,]' $w, $h
    $queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]
    
    # Sample edge background colors (from 4 corners and midpoints)
    $bgSamples = @(
        $srcBmp.GetPixel(0, 0),
        $srcBmp.GetPixel($w - 1, 0),
        $srcBmp.GetPixel(0, $h - 1),
        $srcBmp.GetPixel($w - 1, $h - 1),
        $srcBmp.GetPixel([int]($w/2), 0),
        $srcBmp.GetPixel(0, [int]($h/2)),
        $srcBmp.GetPixel($w - 1, [int]($h/2))
    )
    
    function Is-Background-Color($c) {
        $lum = 0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B
        if ($lum -lt $darkThreshold) { return $true }
        
        # Check distance to any edge sample
        foreach ($bg in $bgSamples) {
            $dist = [Math]::Sqrt([Math]::Pow($c.R - $bg.R, 2) + [Math]::Pow($c.G - $bg.G, 2) + [Math]::Pow($c.B - $bg.B, 2))
            if ($dist -lt $colorTolerance) { return $true }
        }
        return $false
    }
    
    # Seed all border pixels that match background
    for ($x = 0; $x -lt $w; $x++) {
        foreach ($y in @(0, $h - 1)) {
            $c = $srcBmp.GetPixel($x, $y)
            if (Is-Background-Color $c) {
                $visited[$x, $y] = $true
                $queue.Enqueue((New-Object System.Drawing.Point($x, $y)))
            }
        }
    }
    for ($y = 0; $y -lt $h; $y++) {
        foreach ($x in @(0, $w - 1)) {
            if (-not $visited[$x, $y]) {
                $c = $srcBmp.GetPixel($x, $y)
                if (Is-Background-Color $c) {
                    $visited[$x, $y] = $true
                    $queue.Enqueue((New-Object System.Drawing.Point($x, $y)))
                }
            }
        }
    }
    
    # Flood fill
    $dx = @(0, 0, 1, -1)
    $dy = @(1, -1, 0, 0)
    while ($queue.Count -gt 0) {
        $pt = $queue.Dequeue()
        for ($i = 0; $i -lt 4; $i++) {
            $nx = $pt.X + $dx[$i]
            $ny = $pt.Y + $dy[$i]
            if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                if (-not $visited[$nx, $ny]) {
                    $c = $srcBmp.GetPixel($nx, $ny)
                    if (Is-Background-Color $c) {
                        $visited[$nx, $ny] = $true
                        $queue.Enqueue((New-Object System.Drawing.Point($nx, $ny)))
                    }
                }
            }
        }
    }
    
    # Write pixels to outBmp
    for ($x = 0; $x -lt $w; $x++) {
        for ($y = 0; $y -lt $h; $y++) {
            $c = $srcBmp.GetPixel($x, $y)
            if ($visited[$x, $y]) {
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                # Check distance to background boundary for 1-pixel anti-aliasing feather
                $nearBg = $false
                for ($i = 0; $i -lt 4; $i++) {
                    $nx = $x + $dx[$i]
                    $ny = $y + $dy[$i]
                    if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                        if ($visited[$nx, $ny]) { $nearBg = $true; break }
                    }
                }
                if ($nearBg) {
                    $lum = 0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B
                    $alpha = [Math]::Min(255, [Math]::Max(40, [int]($lum * 2.5)))
                    $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
                } else {
                    $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
                }
            }
        }
    }
    
    return $outBmp
}

# Test on test_qyran_idle
$srcImg = [System.Drawing.Bitmap]::FromFile("public\assets\test_qyran_idle.png")
$cleanImg = Remove-Dark-Background $srcImg 50 40
$cleanImg.Save("public\assets\test_qyran_idle_clean.png", [System.Drawing.Imaging.ImageFormat]::Png)
$srcImg.Dispose()
$cleanImg.Dispose()
Write-Host "Generated: public\assets\test_qyran_idle_clean.png"
