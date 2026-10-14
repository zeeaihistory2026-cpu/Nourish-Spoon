package com.nourishspoon.app

import android.app.Activity
import android.os.Build
import android.view.View
import android.view.ViewGroup

/** One visible logo surface from the Android starting window to the first app page. */
object NourishLaunchScreen {
  fun show(activity: Activity) {
    val launch = activity.layoutInflater.inflate(R.layout.nourish_launch_screen, null)
    // Attach to the stable window surface, independent of React's first layout pass.
    (activity.window.decorView as ViewGroup).addView(launch, ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      // Remove the platform exit animation instead of letting it shrink into a second logo.
      activity.splashScreen.setOnExitAnimationListener { splash ->
        splash.remove()
      }
    }
  }

  fun hide(activity: Activity) {
    activity.findViewById<View>(R.id.nourish_launch_overlay)?.let { launch ->
      launch.findViewById<View>(R.id.nourish_launch_mark)?.animate()?.cancel()
      (launch.parent as? ViewGroup)?.removeView(launch)
    }
  }
}
