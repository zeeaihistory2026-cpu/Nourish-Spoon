package com.nourishspoon.app

import android.app.Activity
import android.view.View
import android.view.ViewGroup

/** Displayed by the activity before React, assets, or JS fonts finish loading. */
object NourishLaunchScreen {
  fun show(activity: Activity) {
    val launch = activity.layoutInflater.inflate(R.layout.nourish_launch_screen, null)
    activity.addContentView(launch, ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
  }

  fun hide(activity: Activity) {
    activity.findViewById<View>(R.id.nourish_launch_overlay)?.let { launch ->
      (launch.parent as? ViewGroup)?.removeView(launch)
    }
  }
}
